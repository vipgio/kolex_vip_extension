import path from "path";
import { fileURLToPath } from "url";
import CopyPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDevelopment = process.env.NODE_ENV !== "production";

export default {
	mode: isDevelopment ? "development" : "production",
	entry: {
		background: "./background.js",
		popup: "./popup.js",
		content: "./content.js",
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "[name].js",
	},
	devtool: "source-map", // Enables source maps for easier debugging
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env"], // Allows for ES6+ syntax
					},
				},
			},
			{
				test: /\.css$/, // Add rule for CSS files
				use: [
					"style-loader", // Injects styles into the DOM
					"css-loader", // Translates CSS into CommonJS
					"postcss-loader", // Processes CSS with PostCSS
				],
			},
			{
				test: /\.(png|jpe?g|gif|svg)$/, // If you want to handle images with Webpack
				use: [
					{
						loader: "file-loader",
						options: {
							name: "[path][name].[ext]", // Retain original folder structure
							outputPath: "images/", // Output images in dist/images
						},
					},
				],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./popup.html",
			filename: "popup.html",
			templateParameters: {
				cssPath: isDevelopment ? "dist/styles.css" : "styles.css",
			},
		}),
		new CopyPlugin({
			patterns: [
				{ from: "manifest.json", to: "." }, // Copy manifest.json to dist
				{ from: "modules/**/*", to: "modules/[name][ext]", context: __dirname }, // Copy everything from the custom modules folder
				{ from: "images/**/*", to: "images/[name][ext]" },
			],
		}),
	],
};
