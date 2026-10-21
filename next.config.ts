import type { NextConfig } from 'next';

/**
 * MSW marks `msw/browser` as `"node": null` and `msw/node` as `"browser": null`.
 * Next still resolves Client Component graphs for SSR, so those subpaths must be
 * aliased away in the wrong runtime or the page fails to compile.
 */
const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  // Keep MSW (and its Node interceptors/WASM) out of the Turbopack server bundle.
  serverExternalPackages: ['msw', '@mswjs/interceptors'],
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      ...(isServer
        ? { 'msw/browser': false }
        : { 'msw/node': false }),
    };
    return config;
  },
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
    resolveAlias: {
      'msw/browser': {
        browser: './node_modules/msw/lib/browser/index.js',
        default: './src/mock/empty-module.ts',
      },
      'msw/node': {
        browser: './src/mock/empty-module.ts',
        default: './node_modules/msw/lib/node/index.js',
      },
    },
  },
};

export default nextConfig;
