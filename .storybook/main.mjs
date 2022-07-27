import { readFileSync } from "fs"
import { loadCsf, getStorySortParameter } from '@storybook/csf-tools';

const csfIndexer = async (fileName, opts) => {
  const code = readFileSync(fileName, 'utf-8').toString();
  const parsed = loadCsf(code, { ...opts, fileName }).parse()
  console.log("\n\n\nI parsed", parsed)
  console.log("\n\n\n")

  return parsed;
};


export default {
  stories: ["../output/Story.*/index.js"],
  storyIndexers: [{
    test: /.*/
    , indexer: csfIndexer
  }],
  framework: {
    "name": "@storybook/react-webpack5",
    "options": {}
  },
  staticDirs: ["../."],
  features: { emotionAlias: true },
  core: { builder: `webpack5` },
  webpackFinal: async (webpackConfig) => {
    webpackConfig.resolve.alias = {
      ...webpackConfig.resolve.alias,
      "@tippyjs/react/headless":
        "@tippyjs/react/headless/dist/tippy-react-headless.esm.js",
    };
    webpackConfig.resolve.modules = [...webpackConfig.resolve.modules];
    // Disable Hot Module Reload
    // webpackConfig.entry =
    //   webpackConfig.entry.filter(
    //     singleEntry => !singleEntry.includes(`${sep}webpack-hot-middleware${sep}`)
    //   )
    return webpackConfig;
  },
};
