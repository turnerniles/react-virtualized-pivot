'use strict';

const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractSass = new ExtractTextPlugin({
  filename: 'styles.css',
});
const nodeExternals = require('webpack-node-externals');
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
  entry: [
    './src/index.js',
    './styles/index.scss',
  ],
  externals: [nodeExternals()],
  output: {
    publicPath: './',
    path: path.join(__dirname, 'dist', 'commonjs'),
    filename: 'index.js',
  },
  module: {
    loaders: [babelLoader].concat(loaders),
  },
  plugins: [
    extractSass,
  ],
};
