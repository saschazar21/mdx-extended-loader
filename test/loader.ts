import webpack, { OutputFileSystem } from 'webpack';
import MemoryFs from 'memory-fs';
import { resolve } from 'path';

import MDXLayoutLoaderOptions from '../src/interfaces/options';

const fs = new MemoryFs();
const DEFAULT_OUTPUT = 'wrapped-post.mdx';

export default async (
  relativeUrl: string,
  options: MDXLayoutLoaderOptions
): Promise<[webpack.Stats, string]> => {
  const compiler = webpack({
    context: __dirname,
    entry: resolve(__dirname, relativeUrl),
    output: {
      path: __dirname,
      filename: DEFAULT_OUTPUT
    },
    module: {
      rules: [
        {
          test: /\.mdx?$/,
          use: [
            {
              loader: 'babel-loader',
              query: {
                cacheDirectory: true
              }
            },
            {
              loader: resolve(__dirname, '../src/loader.ts'),
              options
            }
          ]
        },
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'babel-loader',
              query: {
                cacheDirectory: true
              }
            },
            'ts-loader'
          ]
        }
      ]
    }
  });

  compiler.outputFileSystem = fs;

  return new Promise((positive, negative) => {
    compiler.run((err, stats) => {
      if (err) {
        return negative(err);
      }
      if (!stats || stats.hasErrors()) {
        const [statsError] = stats ? stats.toJson().errors : [];
        return negative(
          new Error(statsError || 'Something went wrong while compiling!')
        );
      }
      return positive([
        stats,
        fs.readFileSync(resolve(__dirname, DEFAULT_OUTPUT), 'utf-8')
      ]);
    });
  });
};
