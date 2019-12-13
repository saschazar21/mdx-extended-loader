import babel from "rollup-plugin-babel";
import builtinModules from "builtin-modules";
import nodeResolve from "rollup-plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";

const external = [...builtinModules, "gray-matter"];

const globals = {
  globby: "globby",
  "gray-matter": "matter"
};

const config = {
  external,
  input: "src/index.ts",
  plugins: [nodeResolve(), typescript(), babel({ extensions: [".ts"] })]
};

export default [
  {
    ...config,
    output: [
      {
        file: "index.js",
        format: "cjs",
        globals
      }
    ]
  },
  {
    ...config,
    plugins: [...config.plugins, terser()],
    output: [
      {
        file: "index.min.js",
        file: "cjs",
        globals
      }
    ]
  }
];
