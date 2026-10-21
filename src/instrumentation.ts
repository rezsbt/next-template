export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  if (process.env.NEXT_PUBLIC_MOCK_ENABLED !== '1') return;

  const { server } = await import('@/mock/node');
  server.listen({ onUnhandledFrame: 'bypass' });
}
