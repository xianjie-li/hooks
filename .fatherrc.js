export default {
  entry: ['src/index.ts'],
  esm: 'rollup',
  // cjs: 'rollup',
  umd: true,
  runtimeHelpers: true,   // 一定要在 dependencies 里有 @babel/runtime 依赖

  // extractCSS: true,
  // extraBabelPresets: [], // 额外的 babel preset。
  // extraBabelPlugins: [], // 额外的 babel plugin。
  // extraExternals: string[],

  // target: 'browser', || node
  // doc: {
  //   title: 'use',
  //   dest: './docs',
  //   description: 'a react form validation hook',
    // theme: 'docz-theme-default',
    // logo: {
    //   src: '/path/of/my/logo',
    //   width: 150,
    // },
  // },
}
