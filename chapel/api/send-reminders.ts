/**
 * api/send-reminders.ts — Vercel serverless function
 *
 * Daily cron job that emails each volunteer scheduled for a service in exactly
 * 3 days' time. Vercel Cron fires this as a GET at 08:00 UTC; manual triggers
 * may use POST.
 *
 * Authentication: requires the x-cron-secret header to match CRON_SECRET env var.
 *
 * Environment variables:
 *   SUPABASE_URL          — Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY — service-role key (bypasses RLS for the cron query)
 *   RESEND_API_KEY        — Resend API key
 *   CRON_SECRET           — shared secret verified in x-cron-secret header
 *
 * Response shape: { sent: number; skipped: number; errors: string[] }
 *
 * Idempotency: reminder_sent_at IS NULL guard prevents double-sending.
 * Satisfies: R6, N2
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AssignmentRow {
  id: string
  role_id: string
  roles: {
    name: string
  } | null
  members: {
    name: string
    email: string
  } | null
  services: {
    date: string
    org_id: string
    orgs: {
      name: string
    } | null
  } | null
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  // Allow GET (Vercel Cron) and POST (manual trigger)
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST')
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }

  // -------------------------------------------------------------------------
  // Auth: verify CRON_SECRET
  // -------------------------------------------------------------------------
  const cronSecret = process.env.CRON_SECRET
  const providedSecret = req.headers['x-cron-secret']

  if (!cronSecret || providedSecret !== cronSecret) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  // -------------------------------------------------------------------------
  // Supabase client with service-role key to bypass RLS
  // -------------------------------------------------------------------------
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('[send-reminders] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    res.status(500).json({ error: 'Server misconfiguration: missing Supabase credentials' })
    return
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // -------------------------------------------------------------------------
  // Compute target date: today + 3 days (UTC)
  // -------------------------------------------------------------------------
  const now = new Date()
  const targetDate = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 3,
    ),
  )
  // Format as YYYY-MM-DD to match Postgres `date` column
  const targetDateStr = targetDate.toISOString().slice(0, 10)

  // -------------------------------------------------------------------------
  // Query assignments for services on targetDate that haven't been reminded
  // Join: assignments -> services -> orgs, assignments -> members, assignments -> roles
  // -------------------------------------------------------------------------
  const { data: assignments, error: queryError } = await supabase
    .from('assignments')
    .select(`
      id,
      role_id,
      roles ( name ),
      members ( name, email ),
      services!inner (
        date,
        org_id,
        orgs ( name )
      )
    `)
    .eq('services.date', targetDateStr)
    .is('reminder_sent_at', null)

  if (queryError) {
    console.error('[send-reminders] Query error:', queryError.message)
    res.status(500).json({ error: queryError.message })
    return
  }

  const rows = (assignments ?? []) as unknown as AssignmentRow[]

  // -------------------------------------------------------------------------
  // Send emails
  // -------------------------------------------------------------------------
  let sent = 0
  let skipped = 0
  const errors: string[] = []

  const resendApiKey = process.env.RESEND_API_KEY
  if (!resendApiKey) {
    console.warn(
      '[send-reminders] RESEND_API_KEY is not set — skipping all sends (dev safety net)',
    )
    skipped = rows.length
    res.status(200).json({ sent: 0, skipped, errors: [] })
    return
  }

  const resend = new Resend(resendApiKey)

  for (const row of rows) {
    const assignmentId = row.id
    const memberName = row.members?.name ?? 'Volunteer'
    const memberEmail = row.members?.email

    if (!memberEmail) {
      const msg = `[send-reminders] Assignment ${assignmentId}: member has no email — skipping`
      console.warn(msg)
      skipped++
      continue
    }

    const roleName = row.roles?.name ?? 'your role'
    const serviceDate = row.services?.date ?? targetDateStr
    const churchName = row.services?.orgs?.name ?? 'your church'

    // Format the date as a friendly string, e.g. "Sunday, 1 June 2025"
    const friendlyDate = new Date(serviceDate + 'T00:00:00Z').toLocaleDateString(
      'en-GB',
      { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' },
    )

    try {
      const { error: sendError } = await resend.emails.send({
        from: 'chapel@resend.dev',
        to: memberEmail,
        subject: `Reminder: You're serving this Sunday at ${churchName}`,
        html: `
          <p>Hi ${memberName},</p>
          <p>Just a reminder that you're on <strong>${roleName}</strong> this Sunday (${friendlyDate}). See you there!</p>
          <p>— Chapel</p>
        `.trim(),
      })

      if (sendError) {
        const msg = `Assignment ${assignmentId} (${memberEmail}): ${sendError.message}`
        console.error('[send-reminders] Resend error:', msg)
        errors.push(msg)
        continue
      }

      // Mark reminder sent — only if the email was delivered successfully
      const { error: updateError } = await supabase
        .from('assignments')
        .update({ reminder_sent_at: new Date().toISOString() })
        .eq('id', assignmentId)

      if (updateError) {
        const msg = `Assignment ${assignmentId}: failed to set reminder_sent_at — ${updateError.message}`
        console.error('[send-reminders] Update error:', msg)
        errors.push(msg)
        // Do NOT increment 'sent' — the email was sent but we couldn't record it.
        // The idempotency guard (reminder_sent_at IS NULL) means a re-run will
        // attempt this assignment again, which is the safer behaviour.
        continue
      }

      sent++
    } catch (err) {
      const msg = `Assignment ${assignmentId} (${memberEmail}): unexpected error — ${
        err instanceof Error ? err.message : String(err)
      }`
      console.error('[send-reminders]', msg)
      errors.push(msg)
    }
  }

  console.log(
    `[send-reminders] targetDate=${targetDateStr} sent=${sent} skipped=${skipped} errors=${errors.length}`,
  )

  res.status(200).json({ sent, skipped, errors })
}
