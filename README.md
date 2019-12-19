# 📦 MDX extended loader

> Easily wrap React components around your MDX files

A [Webpack](https://webpack.js.org/) loader for mutating your [MDX](https://mdxjs.com/) files to export a wrapping React component by default. Easy to extend as well.

It already includes the same functionality as [@mdx-js/loader](https://github.com/mdx-js/mdx) provides, so there is no need to chain it to your Webpack configuration.

## Installation

`yarn add @saschazar/mdx-layout-loader`

or

`npm install --save @saschazar/mdx-layout-loader`

([@mdx-js/react](https://github.com/mdx-js/mdx) is a dependency you will need when transpiling React to JavaScript code, so be sure to take a look at the `peerDependencies` as well.)

## How it works

Given the following project tree, where all the `mdx` files should be wrapped in a layout from the `layouts` directory:

```
MyApp
|
├─ pages
|  ├ index.tsx
|  ├ about.mdx
|  ├─ blog
|     ├ 2019-12-19_first-blog-post.mdx
|
├─ layouts
   ├ index.tsx
   ├ custom.tsx
```

It works just as any other Webpack loader, although it is mainly targeted towards transpiling `mdx` and `md` files.

Basically, a simple webpack rule for this use case might look like the following:

```javascript
{
  // other webpack config options
  module: {
      rules: [
        {
          test: /\.mdx?$/,
          use: [
            {
              loader: 'babel-loader', // needed for transpiling React code
              query: {
                cacheDirectory: true
              }
            },
            {
              loader: '@saschazar/mdx-extended-loader',
              options: {
                extensions: ['jsx', 'js'], // the file suffixes the layouts
                layoutsDir: 'layouts' // relative to process.cwd()
              }
            }
          ]
        },
      ]
    }
  });
}
```

### Options

_Work in progress_

## License

Licensed under the MIT license.

Copyright ©️ 2019 [Sascha Zarhuber](https://github.com/saschazar21)
