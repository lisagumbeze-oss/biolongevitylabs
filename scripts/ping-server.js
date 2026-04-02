const https = require('https');

// Configuration
const SERVER_URL = process.env.SERVER_URL || 'https://biolongevitylabss.com/api/ping';
const INTERVAL = 5 * 60 * 1000; // 5 minutes

console.log(`[Pinger] Starting auto-ping for: ${SERVER_URL}`);

function ping() {
  https.get(SERVER_URL, (res) => {
    console.log(`[Pinger] Ping sent. Status: ${res.statusCode} at ${new Date().toISOString()}`);
  }).on('error', (err) => {
    console.error(`[Pinger] Ping failed: ${err.message}`);
  });
}

// Initial ping
ping();

// Schedule pings if running as a persistent process
if (process.argv.includes('--watch')) {
  setInterval(ping, INTERVAL);
} else {
  console.log('[Pinger] One-time ping complete. Use --watch for continuous pings.');
}
