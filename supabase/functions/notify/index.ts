// POST /notify
//
// Server-side push trigger. Used internally (no JWT verification) by other
// Edge Functions / scheduled jobs to nudge users — e.g. "your generated track
// is ready".
//
// Body: { userId: string, title: string, body: string, data?: object, channelId?: string }
//
// Guard this with a shared secret so it can't be hit externally:
//   header `x-internal-secret` must match env NOTIFY_INTERNAL_SECRET.

import { corsHeaders } from '../_shared/cors.ts';
import { serviceClient } from '../_shared/supabase.ts';

const NOTIFY_INTERNAL_SECRET = Deno.env.get('NOTIFY_INTERNAL_SECRET') ?? '';
const EXPO_PUSH_API = 'https://exp.host/--/api/v2/push/send';

interface Body {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  channelId?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return new Response('method not allowed', { status: 405 });

  if (NOTIFY_INTERNAL_SECRET) {
    if (req.headers.get('x-internal-secret') !== NOTIFY_INTERNAL_SECRET) {
      return new Response('forbidden', { status: 403 });
    }
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return new Response('invalid json', { status: 400 });
  }
  if (!body.userId || !body.title || !body.body) {
    return new Response('userId, title and body are required', { status: 400 });
  }

  const svc = serviceClient();
  const { data: profile } = await svc
    .from('profiles')
    .select('expo_push_token')
    .eq('id', body.userId)
    .single();
  if (!profile?.expo_push_token) {
    return new Response(JSON.stringify({ sent: false, reason: 'no token' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const message = {
    to: profile.expo_push_token,
    sound: 'default',
    title: body.title,
    body: body.body,
    data: body.data ?? {},
    channelId: body.channelId ?? 'default',
  };

  const res = await fetch(EXPO_PUSH_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept-Encoding': 'gzip, deflate' },
    body: JSON.stringify(message),
  });

  const out = await res.json().catch(() => ({}));
  return new Response(JSON.stringify({ sent: res.ok, response: out }), {
    status: res.ok ? 200 : 502,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
