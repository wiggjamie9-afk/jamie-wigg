/**
 * Cloudflare Worker: SMS Vet Alert Handler
 * Route: POST /api/sms/send
 *
 * Receives: { vetPhone, message, photoUrl, animalId, actionId }
 * Returns: { success, messageId, error }
 *
 * In production, this would integrate with Twilio or similar SMS provider.
 * For now, it logs to a mock service and returns success.
 */

export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    try {
      const body = await request.json();
      const { vetPhone, message, photoUrl, animalId, actionId } = body;

      // Validate required fields
      if (!vetPhone || !message || !actionId) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: vetPhone, message, actionId' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // In production, send via Twilio:
      // const client = require('twilio')(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
      // const msg = await client.messages.create({
      //   body: message,
      //   from: env.TWILIO_PHONE_NUMBER,
      //   to: vetPhone
      // });
      // const messageId = msg.sid;

      // For testing/development, log to KV and return success
      const messageId = `sms_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

      // Optionally store in KV for audit trail (requires KV_SMS_LOG binding)
      if (env.KV_SMS_LOG) {
        const logEntry = {
          actionId,
          messageId,
          vetPhone: maskedPhone(vetPhone),
          animalId,
          message,
          timestamp: new Date().toISOString(),
          status: 'sent'
        };
        await env.KV_SMS_LOG.put(`sms_${messageId}`, JSON.stringify(logEntry), {
          expirationTtl: 86400 * 30 // 30 days
        });
      }

      return new Response(
        JSON.stringify({
          success: true,
          messageId,
          status: 'sent'
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } catch (err) {
      console.error('SMS handler error:', err);
      return new Response(
        JSON.stringify({ error: err.message || 'Internal server error' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }
};

function maskedPhone(phone) {
  if (!phone || phone.length < 4) return '****';
  return phone.slice(0, -4).replace(/\d/g, '*') + phone.slice(-4);
}
