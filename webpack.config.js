const path = require("path");
const webpack = require("webpack");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const { merge } = require("webpack-merge");

const dev = process.env.NODE_ENV !== "production";

const HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  template: path.join(__dirname, "/public/index.html"),
  filename: "index.html",
  inject: "body",
});

const commonConfig = {
  entry: ["@babel/polyfill", path.join(__dirname, "/src/index.ts")],
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: "babel-loader",
      },
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre",
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: "url-loader",
        options: {
          limit: 10000,
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "index.js",
    path: path.join(__dirname, "/dist"),
  },
  plugins: [HTMLWebpackPluginConfig],
};

const productionConfig = {
  mode: "production",
  plugins: [new webpack.HotModuleReplacementPlugin()],
};

const developmentConfig = {
  mode: "development",
  devServer: {
    host: "localhost",
    port: "3000",
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    historyApiFallback: true,
  },
};

module.exports = (env) => {
  if (env.analyze) {
    commonConfig.plugins.push(new BundleAnalyzerPlugin());
  }

  switch (env.mode) {
    case "development":
      return merge(commonConfig, developmentConfig);
    case "production":
      return merge(commonConfig, productionConfig);
    default:
      throw new Error("No matching configuration was found!");
  }
};
