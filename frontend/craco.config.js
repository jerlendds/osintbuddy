const path = require("path");
const cracoSwcPlugin = require("craco-swc");

module.exports = {
  plugins: [
    {
      plugin: cracoSwcPlugin,
      options: {
        swcLoaderOptions: {
          jsc: {
            externalHelpers: true,
            target: "es2015",
            parser: {
              syntax: "typescript",
              tsx: true,
              dynamicImport: true,
              exportDefaultFrom: true,
              privateMethod: false,
              functionBind: false,
              exportNamespaceFrom: false,
              decorators: false,
              decoratorsBeforeExport: false,
              topLevelAwait: false,
              importMeta: false,
            },
            transform: {
              react: {
                runtime: "automatic",
              },
            },
          },
        },
      },
    },
  ],
  webpack: {
    alias: {
      "@src": path.resolve(__dirname, "src"),
      "@app": path.resolve(__dirname, "src/app"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@images": path.resolve(__dirname, "src/assets/images"),
      "@styles": path.resolve(__dirname, "src/assets/styles"),
      "@components": path.resolve(__dirname, "src/components"),
      "@routes": path.resolve(__dirname, "src/routes"),
    },
    resolve: {
      fallback: {
        util: require.resolve("util/"),
        buffer: require.resolve("buffer/"),
      },
    },
  },
  eslint: {
    enable: false,
  },
};
