module.exports = {
  devServer: {
    watchOptions: {
      poll: 1000,
      aggregateTimeout: 300,
      ignored: /node_modules/,
    },
    hot: true,
    liveReload: true,
  },
  webpack: {
    configure: (webpackConfig) => {
      if (process.env.NODE_ENV === "development") {
        webpackConfig.watchOptions = {
          poll: 1000,
          aggregateTimeout: 300,
          ignored: /node_modules/,
        };
      }

      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        process: require.resolve("process/browser"),
      };

      const webpack = require("webpack");
      webpackConfig.plugins = [
        ...webpackConfig.plugins,
        new webpack.ProvidePlugin({
          process: "process/browser",
        }),
      ];

      return webpackConfig;
    },
  },
};
