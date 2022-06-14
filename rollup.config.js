import pkg from "./package.json"
import typescript from '@rollup/plugin-typescript'
export default {
  input: "./src/index.ts",
  output: [
    // 1.cjs - commonjs 规范
    {
      format: "cjs",
      file: pkg.main,
    },
    // 2.esm - 标准化规范
    {
      format: "es",
      file: pkg.module
    }
  ],
  // 配置 plugin
  plugins: [
    typescript()
  ]
}
