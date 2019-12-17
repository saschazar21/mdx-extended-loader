import babel from 'rollup-plugin-babel';
import builtinModules from 'builtin-modules';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

const external = [
  ...builtinModules,
  '@mdx-js/mdx',
  'capital-case',
  'globby',
  'gray-matter',
  'loader-utils',
  'param-case'
];

const globals = {
  '@mdx-js/mdx': 'mdx',
  'capital-case': 'capitalCase',
  globby: 'globby',
  'gray-matter': 'matter',
  'param-case': 'paramCase',
  webpack: 'webpack'
};

const config = {
  external,
  input: 'src/index.ts',
  plugins: [
    nodeResolve(),
    commonjs({
      exclude: /node_modules/,
      sourceMap: false
    }),
    typescript({
      useTsconfigDeclarationDir: true
    }),
    babel({ extensions: ['.ts'] })
  ]
};

export default [
  {
    ...config,
    output: [
      {
        file: 'index.js',
        format: 'cjs',
        globals
      }
    ]
  },
  {
    ...config,
    plugins: [...config.plugins, terser()],
    output: [
      {
        file: 'index.min.js',
        format: 'cjs',
        globals
      }
    ]
  }
];
