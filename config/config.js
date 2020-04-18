import path from 'path';

export default {
  history: { type: 'hash' },
  outputPath: 'docs',
  base: '/hooks/',
  publicPath: '/hooks/',
  title: 'hooks',
  description: 'Use Your Imagination',
  resolve: {
    includes: ['src'],
  },
  dynamicImport: {
    loading: '@/Loading',
  },
};
