exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const permalink = process.env.GUMROAD_PRODUCT_PERMALINK;
  if (!permalink) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'GUMROAD_PRODUCT_PERMALINK not set' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { licenseKey } = body;
  if (!licenseKey) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'licenseKey required' }) };
  }

  try {
    const res = await fetch('https://api.gumroad.com/v2/licenses/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        product_permalink: permalink,
        license_key: licenseKey.trim(),
        increment_uses_count: 'false',
      }),
    });

    const data = await res.json();

    if (data.success) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          valid: true,
          email: data.purchase?.email,
        }),
      };
    } else {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ valid: false, error: data.message || 'Invalid license key' }),
      };
    }
  } catch (err) {
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
