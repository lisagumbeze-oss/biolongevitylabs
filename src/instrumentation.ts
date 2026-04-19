export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Always log that instrumentation is at least attempting to start
    console.log(`[Instrumentation] Registering server-side hooks (Mode: ${process.env.NODE_ENV})`);
  }
}
