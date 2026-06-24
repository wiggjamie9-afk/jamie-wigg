// Mock API handler for local development
// This intercepts fetch calls to /api/* and responds with mock data

(function() {
  const originalFetch = window.fetch;

  window.fetch = function(...args) {
    const [url, options = {}] = args;
    const urlStr = typeof url === 'string' ? url : url.toString();

    // Intercept SMS send endpoint
    if (urlStr.includes('/api/sms/send') && options.method === 'POST') {
      return handleSmsSend(options);
    }

    // Pass through to original fetch
    return originalFetch(...args);
  };

  async function handleSmsSend(options) {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const body = JSON.parse(options.body);
          const { vetPhone, message, actionId } = body;

          // Validate
          if (!vetPhone || !message || !actionId) {
            resolve(new Response(
              JSON.stringify({ error: 'Missing required fields' }),
              { status: 400, headers: { 'Content-Type': 'application/json' } }
            ));
            return;
          }

          // Log to console for debugging
          console.log('[Mock SMS API] Sending message:', {
            to: vetPhone,
            message: message.substring(0, 50) + '...',
            actionId
          });

          // Mock success response
          const messageId = `mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
          resolve(new Response(
            JSON.stringify({
              success: true,
              messageId,
              status: 'sent',
              mock: true,
              note: 'This is a mock response. Configure real SMS provider in production.'
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            }
          ));
        } catch (err) {
          console.error('[Mock SMS API] Error:', err);
          resolve(new Response(
            JSON.stringify({ error: err.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          ));
        }
      }, 300); // Simulate network delay
    });
  }
})();
