import path from 'path';

export default {
  history: { type: 'hash' },
  outputPath: 'docs',
  base: '/hooks/',
  publicPath: '/hooks/',
  title: 'hooks',
  description: 'Use Your Imagination',
  alias: {
    '@': path.resolve(__dirname, '../src'),
    '@lxjx/hooks': path.resolve(__dirname, '../src/index.ts'),
  },
  resolve: {
    includes: ['src'],
  },
  // dynamicImport: {
  //   loading: '@/Loading',
  // },
};
