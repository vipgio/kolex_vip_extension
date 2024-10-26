import path from "path";
import { fileURLToPath } from "url";
import CopyPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
	mode: "development", // Use 'production' for production builds
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
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./popup.html", // Use your existing popup.html as a template
			filename: "popup.html", // Output file in dist directory
		}),
		new CopyPlugin({
			patterns: [
				{ from: "manifest.json", to: "." }, // Copy manifest.json to dist
				// Add additional static files here if needed, like icons
			],
		}),
	],
};
