'use strict';
const webpack = require('webpack');
const path = require('path');
const loaders = require('./webpack.loaders');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

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
  entry: [
    'babel-polyfill',
    './src/index.jsx',
    './styles/index.scss',
  ],
  output: {
    publicPath: './',
    path: path.join(__dirname, 'docs'),
    filename: '[chunkhash].js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    loaders: [babelLoader].concat(loaders),
  },
  plugins: [
    new WebpackCleanupPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        drop_console: true,
        drop_debugger: true,
      },
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new ExtractTextPlugin({
      filename: '../styles.css',
      allChunks: true,
    }),
    new HtmlWebpackPlugin({
      template: './src/template.html',
      files: {
        css: ['style.css'],
        js: ['bundle.js'],
      },
    }),
  ],
};
