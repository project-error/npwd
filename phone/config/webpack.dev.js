const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.tsx',
  output: {
    publicPath: 'auto',
    filename: '[name].js',
    clean: true,
  },
  devServer: {
    port: 3000,
    hot: true,
  },
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        include: path.join(__dirname, '../typings/'),
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      inject: true,
    }),
    new webpack.DefinePlugin({
      process: { env: {} },
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', 'jsx'],
    alias: {
      '@os': path.resolve(__dirname, '../src/os/'),
      '@ui': path.resolve(__dirname, '../src/ui/'),
      '@common': path.resolve(__dirname, '../src/common/'),
      '@utils': path.resolve(__dirname, '../src/utils/'),
      '@apps': path.resolve(__dirname, '../src/apps/'),
      '@typings': path.resolve(__dirname, '../../typings/'),
    },
  },
};
