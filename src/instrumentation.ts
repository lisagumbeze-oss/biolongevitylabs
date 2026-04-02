export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const isProd = process.env.NODE_ENV === 'production';
    
    // Always log that instrumentation is at least attempting to start
    console.log(`[Instrumentation] Registering server-side hooks (Mode: ${process.env.NODE_ENV})`);

    // Only run the pinger in production to avoid cluttering dev logs
    if (!isProd) return;

    const baseUrl = process.env.RENDER_EXTERNAL_URL || 'https://biolongevitylabss.com';
    const pingUrl = `${baseUrl}/api/ping`;
    
    console.log(`[Keep-Alive] Initializing auto-ping for: ${pingUrl}`);
    
    // Immediate ping to verify connectivity on boot
    fetch(pingUrl)
      .then(r => console.log(`[Keep-Alive] Initial boot ping success: ${r.status}`))
      .catch(err => console.error('[Keep-Alive] Initial boot ping failed:', err.message));

    // Ping every 5 minutes
    setInterval(async () => {
      try {
        const start = Date.now();
        const response = await fetch(pingUrl);
        const duration = Date.now() - start;
        console.log(`[Keep-Alive] Ping SUCCESS | Status: ${response.status} | Duration: ${duration}ms | URL: ${pingUrl}`);
      } catch (error: any) {
        console.error(`[Keep-Alive] Ping FAILED | Error: ${error.message} | URL: ${pingUrl}`);
      }
    }, 5 * 60 * 1000);
  }
}
