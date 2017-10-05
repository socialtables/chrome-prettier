const path = require("path");
const webpack = require("webpack");

module.exports = {
	entry: "./index.js",
	output: {
		path: path.join(__dirname, "dist"),
		filename: "index.js"
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
	}
};
