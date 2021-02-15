const path = require('path');
const CommonWebpack = require('./webpack.common');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = CommonWebpack({
  mode: 'development',
  devtool: 'inline-source-map',
  entry: ['react-devtools', './src/index.tsx'],
  // Output path
  output: {
    path: path.resolve(process.cwd(), 'build'),
    filename: 'index.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      inject: true,
      minify: false,
    }),
  ],
});
