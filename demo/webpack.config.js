const webpack = require('webpack')
const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')

/** @type {webpack.Configuration} */
module.exports = {
	entry: path.join(__dirname, 'src/App.tsx'),
	mode: 'development',
	watch: true,
	devServer: {
		contentBase: path.join(__dirname, 'app'),
		compress: false,
		port: 3100,
		historyApiFallback: true,
	},
	devtool: 'inline-source-map',
	resolve: {
		extensions: ['.js', '.ts', '.json', '.tsx', '.css', '.scss', '.mp3', '.png', '.vert', '.frag'],
	},
	module: {
		rules: [
			{ test: /\.tsx?$/, loader: 'ts-loader'   },
			{ test: /\.(mp3|png)$/, loader: 'file-loader', options: { name: '[path][name].[ext]' } },
			{ test: /\.s?css$/, loader: ['style-loader', 'css-loader', 'sass-loader'] },
			{ test: /\.(vert|frag)$/, loader: 'raw-loader' },
		]
	},
	plugins: [
		new HTMLWebpackPlugin({
			title: 'React Audio Engine Test',
			favicon: path.join(__dirname, 'src/favicon.png')
		})
	],
	output: {
		path: path.join(__dirname, 'app'),
		filename: '[name].js',
	}
}
