import typescript from '@rollup/plugin-typescript'
export default {
  input: "./src/index.ts",
  output: [
    // 1.cjs - commonjs 规范
    {
      format: "cjs",
      file: "lib/mini-vue.cjs.js"
    },
    // 2.esm - 标准化规范
    {
      format: "es",
      file: "lib/mini-vue.esm.js"
    }
  ],
  // 配置 plugin
  plugins: [
    typescript()
  ]
}
