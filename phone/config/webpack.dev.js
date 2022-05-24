const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const deps = require('../package.json').dependencies;

//const baseUrl = 'http://localhost:3003/remoteEntry.js';
// [key]: `${key}@https://cfx-nui-${key}_app/remoteEntry.js'`,
const communityApps = require('../../communityApps');
const remotes = Object.keys(communityApps).reduce((prev, key) => {
  return {
    ...prev,
    weather: `weather@http://localhost:3002/remoteEntry.js`,
  };
}, {});

module.exports = {
  entry: './src/bootstrap.ts',
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
    new ModuleFederationPlugin({
      name: 'layout',
      filename: 'remoteEntry.js',
      remotes,
      exposes: {
        './settings': './src/apps/settings/hooks/useSettings',
        './phone': './src/os/phone/hooks',
        './contacts': './src/apps/contacts/hooks/state',
      },
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
      process: { env: {} },
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
      '@typings': path.resolve(__dirname, '../../typings/'),
      '@shared': path.resolve(__dirname, '../../shared'),
    },
  },
};
