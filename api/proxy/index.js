const https = require('https');
const http = require('http');

module.exports = async function (context, req) {
  const path = context.bindingData.path || '';
  const backendUrl = `https://20.164.0.168/academy/${path}`;

  context.log(`Proxying request to: ${backendUrl}`);

  // Get the appropriate protocol handler
  const protocol = backendUrl.startsWith('https') ? https : http;

  return new Promise((resolve) => {
    const options = {
      method: req.method,
      headers: {
        ...req.headers,
        host: '20.164.0.168',
      },
      // Allow self-signed certificates
      rejectUnauthorized: false,
    };

    // Remove host header to avoid conflicts
    delete options.headers['host'];
    delete options.headers['x-forwarded-host'];
    delete options.headers['x-forwarded-proto'];

    const proxyReq = protocol.request(backendUrl, options, (proxyRes) => {
      let body = '';

      proxyRes.on('data', (chunk) => {
        body += chunk;
      });

      proxyRes.on('end', () => {
        context.res = {
          status: proxyRes.statusCode,
          headers: {
            'content-type': proxyRes.headers['content-type'] || 'application/json',
            'access-control-allow-origin': '*',
            'access-control-allow-methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'access-control-allow-headers': 'Content-Type, Authorization',
          },
          body: body,
        };
        resolve();
      });
    });

    proxyReq.on('error', (error) => {
      context.log.error('Proxy error:', error);
      context.res = {
        status: 500,
        body: { error: 'Proxy request failed', details: error.message },
      };
      resolve();
    });

    // Forward the request body if present
    if (req.body) {
      const bodyString = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      proxyReq.write(bodyString);
    }

    proxyReq.end();
  });
};
