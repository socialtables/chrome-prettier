const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: {
		index: "./index.js",
		popup: "./popup/popup.js"
	},
	output: {
		path: path.join(__dirname, "dist"),
		filename: "[name].js"
	},
	devtool: process.env.NODE_ENV === "development" ? "eval-cheap-module-source-map" : "source-map",
	context: path.resolve(__dirname, "src"),
	module: {
		rules: [
			{
				test: /\.js?$/,
				include: [
					path.join(__dirname, "src")
				],
				loader: "babel-loader"
			}
		]
  },
  plugins: [
     new webpack.DefinePlugin({
       'process.env': {
         'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
       }
	 }),
	 new HtmlWebpackPlugin({
		 path: path.join(__dirname, "dist"),
		 template: path.join(__dirname, "popup-template.html"),
		 filename: "popup.html",
		 inject: "body",
		 chunks: ["popup"]
	 })
  ]
};
