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

It works just as any other Webpack loader, although it is mainly targeted towards transpiling `mdx` and `md` files.

### Initial situation

Given the following project tree, where all the `mdx` files should be wrapped in a layout from the `layouts` directory:

```
MyApp
|
├─ pages
|  ├ index.jsx
|  ├ about.mdx
|  ├─ blog
|     ├ 2019-12-19_first-blog-post.mdx
|
├─ layouts
   ├ index.jsx
   ├ custom.jsx
```

### Goal

With two files in the `layouts` directory, Webpack should look for `mdx` files in the project tree and wrap the most suitable layout around each of them.

The file in the `pages/blog` directory includes a date string in its filename, so this information should be parsed as well.

### Enter Webpack

To achieve the goal, Webpack should do the following:

1. parse information from the filename (_date_ and _title_)
1. mix the data with possibly included frontmatter (e.g. _layout_, etc...)
1. select a layout and wrap it around its contents

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

## Options

In order to customize the Webpack flow, the following options may be applied to the configuration.

In addition to the options below, the `options` object may be extended with the options of the [@mdx-js/mdx](https://github.com/mdx-js/mdx) module.

### `extensions`

> `array` | mandatory | example: `['jsx', 'js']`

The file extensions of possible layouts to look for in the `layoutsDir` directory

### `layouts`

> `string` | mandatory | example: `layouts`

The relative path to the layouts directory in the project's working directory

### `parseFilename`

> `boolean` | optional | default: `true`

Whether to attempt to parse the `mdx` filename for `date` and `title`

### `useDefault`

> `boolean` | optional | default: `true`

Whether to use the `index` file in the layouts directory as fallback, when no `layout` key was given in the frontmatter

## License

Licensed under the MIT license.

Copyright ©️ 2019 [Sascha Zarhuber](https://github.com/saschazar21)
