// rollup天生支持esm
import typescript from "@rollup/plugin-typescript";
export default {
  input: "./src/index.ts",
  output: [
    // 1.cjs 2.esm  打包多种规范
    {
      format: "cjs",
      file: "lib/guide-mini-vue.cjs.js",
    },
    {
      format: "esm",
      file: "lib/guide-mini-vue.esm.js",
    },
  ],
  plugins: [typescript()],
};
