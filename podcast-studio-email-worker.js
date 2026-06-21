/**
 * Cloudflare Worker: Email Signup Handler
 * Deploys to: podcast-studio.rhythmixapp.com.au/api/email-signup
 * Handles: Form submissions → SendGrid contact list → GA4 tracking
 */

export default {
  async fetch(request, env) {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only accept POST
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: corsHeaders,
      });
    }

    try {
      const body = await request.json();
      const { email, firstName = 'Friend', source = 'landing-page' } = body;

      if (!email || !email.includes('@')) {
        return new Response(JSON.stringify({ error: 'Invalid email' }), {
          status: 400,
          headers: corsHeaders,
        });
      }

      // 1. Add to SendGrid contact list
      const sendgridRes = await addToSendGrid(email, firstName, source, env);

      if (!sendgridRes.ok) {
        console.error('SendGrid error:', await sendgridRes.text());
        return new Response(JSON.stringify({ error: 'Failed to add contact' }), {
          status: 500,
          headers: corsHeaders,
        });
      }

      // 2. Log to analytics (optional: send event to GA4 backend)
      await logEvent('email_signup', { email, source }, env);

      return new Response(JSON.stringify({
        success: true,
        message: 'Added to early access list',
        email,
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: corsHeaders,
      });
    }
  },
};

async function addToSendGrid(email, firstName, source, env) {
  const SENDGRID_API_KEY = env.SENDGRID_API_KEY;
  const LIST_ID = env.SENDGRID_LIST_ID || '5caa8be6-fcb9-4d9f-8818-e3d6f57c40df'; // Replace with real list ID

  // Step 1: Create or update contact
  const contactRes = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contacts: [{
        email: email,
        first_name: firstName,
        custom_fields: {
          e1_T: 'free', // subscription_tier
          e2_T: new Date().toISOString(), // signup_date
          e3_T: source, // signup_source (landing-page, twitter, referral, etc.)
        },
      }],
    }),
  });

  if (!contactRes.ok) {
    throw new Error(`SendGrid contact creation failed: ${contactRes.statusText}`);
  }

  // Step 2: Add to list (automation trigger)
  const listRes = await fetch(
    `https://api.sendgrid.com/v3/marketing/lists/${LIST_ID}/contacts`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contacts: [email],
      }),
    }
  );

  return listRes;
}

async function logEvent(eventName, eventData, env) {
  // Optional: Send to Google Analytics 4 via Measurement Protocol
  // https://developers.google.com/analytics/devguides/collection/protocol/ga4

  const GA4_ID = env.GA4_MEASUREMENT_ID || 'G-WRRWLW5DNQ';
  const GA4_SECRET = env.GA4_SECRET || 'placeholder'; // Generate in GA4 settings

  const payload = {
    client_id: eventData.email || 'anonymous', // Use email as pseudo-client-id
    events: [{
      name: eventName,
      params: {
        email: eventData.email,
        source: eventData.source,
        timestamp_micros: Date.now() * 1000,
      },
    }],
  };

  // Send to GA4 Measurement Protocol
  await fetch(
    `https://www.google-analytics.com/mp/collect?api_secret=${GA4_SECRET}&measurement_id=${GA4_ID}`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  ).catch(err => console.error('GA4 logging failed:', err));
}
