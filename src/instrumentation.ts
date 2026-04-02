export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const isProd = process.env.NODE_ENV === 'production';
    
    // Only run in production to avoid unnecessary pings during development
    if (!isProd) return;

    // Use RENDER_EXTERNAL_URL from Render env, fallback to provided site URL
    const baseUrl = process.env.RENDER_EXTERNAL_URL || 'https://biolongevitylabss.com';
    const pingUrl = `${baseUrl}/api/ping`;
    
    console.log(`[Keep-Alive] Initializing auto-ping for: ${pingUrl}`);
    
    // Ping immediately on start
    fetch(pingUrl).catch(err => console.error('[Keep-Alive] Initial ping failed:', err));

    // Then ping every 5 minutes (300,000 ms)
    setInterval(async () => {
      try {
        const response = await fetch(pingUrl);
        console.log(`[Keep-Alive] Ping sent to ${pingUrl}. Status: ${response.status}`);
      } catch (error) {
        console.error('[Keep-Alive] Ping failed:', error);
      }
    }, 5 * 60 * 1000);
  }
}
