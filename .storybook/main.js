
module.exports = {
  stories: ["../output/Story.*/index.js"],
  core: { builder: `webpack5` },
  addons: [],
  framework: "@storybook/react",
  webpackFinal: async config => {
    config.module.rules =
      [...config.module.rules,
      {
        test: /\.worker\.js$/,
        use: { loader: "worker-loader" },
      }
      ];

    return config;
  },
}
