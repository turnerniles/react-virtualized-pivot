var ExtractTextPlugin = require('extract-text-webpack-plugin');
var loaders = require('./webpack.loaders');
var path = require('path')
var webpack = require('webpack')

loaders.push({
	test: /\.css$/,
	loaders: ['style-loader', 'css-loader?importLoaders=1'],
	exclude: ['node_modules']
});

loaders.push({
	test: /\.scss$/,
	loader: ExtractTextPlugin.extract({fallback: 'style-loader', use : 'css-loader?sourceMap&localIdentName=[local]___[hash:base64:5]!sass-loader?outputStyle=expanded'}),
	exclude: ['node_modules']
});

module.exports = {
  devtool: 'source-map',
  entry: {
    'react-virtualized-pivot': './src/components/Pivot/Pivot.jsx'
  },
  output: {
    path: 'docs/umd',
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'VirtualizedSelect'
  },
  externals: {
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      root: 'React'
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom',
      root: 'ReactDOM'
    }
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
				drop_debugger: true
			}
		})
  ],
  module: {
    loaders
  }
}
