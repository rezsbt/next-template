export const env = {
  SERVER_PREFIX: process.env.NEXT_PUBLIC_SERVER_PREFIX || '',
  SERVER_ADDRESS: process.env.NEXT_PUBLIC_SERVER_ADDRESS || '',
  MOCK_ENABLED: process.env.NEXT_PUBLIC_MOCK_ENABLED === '1',
};
