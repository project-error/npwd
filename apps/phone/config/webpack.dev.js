const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const deps = require('../package.json').dependencies;

module.exports = () => ({
  entry: './src/bootstrap.ts',
  output: {
    path: path.resolve(__dirname, '../../../dist/html'),
    filename: '[name].js',
    clean: true,
  },
  devServer: {
    port: 3000,
    hot: true,
    devMiddleware: {
      writeToDisk: !!process.env.REACT_APP_IN_GAME,
    },
  },
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
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'layout',
      filename: 'remoteEntry.js',
      exposes: {
        './ui': './src/ui/components/index',
      },
      remotes: {},
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: deps['react-dom'],
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new webpack.DefinePlugin({
      process: { env: { REACT_APP_IN_GAME: process.env.REACT_APP_IN_GAME } },
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@os': path.resolve(__dirname, '../src/os/'),
      '@ui': path.resolve(__dirname, '../src/ui/'),
      '@common': path.resolve(__dirname, '../src/common/'),
      '@utils': path.resolve(__dirname, '../src/utils/'),
      '@apps': path.resolve(__dirname, '../src/apps/'),
      '@typings': path.resolve(__dirname, '../../../typings/'),
      '@shared': path.resolve(__dirname, '../../../shared'),
    },
  },
});
