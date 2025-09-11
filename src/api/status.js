// api/status.js
// This file should be placed in the 'api' folder in your Vercel project root

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if OpenAI API key is configured
    const apiKey = process.env.OPENAI_API_KEY;
    const hasApiKey = !!apiKey;

    // Basic API key format validation
    const isValidFormat =
      hasApiKey &&
      typeof apiKey === 'string' &&
      apiKey.startsWith('sk-') &&
      apiKey.length > 20;

    res.status(200).json({
      status: 'online',
      timestamp: new Date().toISOString(),
      apiKey: {
        configured: hasApiKey,
        validFormat: isValidFormat,
      },
      environment: process.env.NODE_ENV || 'development',
    });
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Status check failed',
    });
  }
}
