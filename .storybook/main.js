module.exports = {
  stories: ["../output/Story.*/index.js"],
  core: { builder: `webpack5` },
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions"
  ],
  framework: "@storybook/react"
}
