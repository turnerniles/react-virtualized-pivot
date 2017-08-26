'use strict';
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const loaders = require('./webpack.loaders');

loaders.push({
  test: /\.css$/,
  loaders: ['style-loader', 'css-loader?importLoaders=1', 'postcss-loader'],
  exclude: ['node_modules'],
});

loaders.push({
  test: /\.scss$/,
  loader: ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: 'css-loader?sourceMap&localIdentName=[local]___[hash:base64:5]!sass-loader?outputStyle=expanded',
  }),
  exclude: ['node_modules'],
});

const babelLoader = {
  test: /\.jsx?$/,
  exclude: /(node_modules|bower_components|public\/)/,
  loader: 'babel-loader',
};

module.exports = {
  entry: {
    index: './src/components/Pivot/Pivot.jsx',
  },
  externals: [nodeExternals()],
  output: {
    path: path.join(__dirname, 'dist', 'es'),
    filename: 'index.js',
    libraryTarget: 'umd',
  },
  module: {
    loaders: [babelLoader].concat(loaders),
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'styles.css',
      allChunks: false,
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        drop_console: true,
        drop_debugger: true,
      },
    }),
  ],
};
