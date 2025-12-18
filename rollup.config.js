// rollup天生支持esm
import typescript from "@rollup/plugin-typescript";
import pkg from "./package.json";
export default {
  input: "./src/index.ts",
  output: [
    // 1.cjs 2.esm  打包多种规范
    {
      format: "cjs",
      file: pkg.main,
    },
    {
      format: "esm",
      file: pkg.module,
    },
  ],
  plugins: [typescript()],
};
