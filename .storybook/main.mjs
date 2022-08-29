import { promises } from "fs";
import { resolve } from "path";
import { loadCsf } from '@storybook/csf-tools';

const mapWithKeys = (obj, fn) => Object.fromEntries(Object.entries(obj).map(([k, v], i) => fn(k, v, i)));

const capitalise = str => {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const csfIndexer = async (fileName, opts) => {
  const outputFile = fileName.slice(0, -5).split("/").reduce((acc, curr) => {
    if (acc == "") {
      if (curr == "stories") return "./output/";
      return "";
    }

    return acc + curr + ".";
  }, "").slice(0, -1) + "/index.js";
  // console.log("Filename", fileName)
  // console.log("OutputFile", outputFile)
  // console.log("abs output", resolve(outputFile))
  const absOutput = resolve(outputFile)

  const buffer = await promises.readFile(fileName, 'utf-8');
  const code = buffer.toString(); // console.log(code)

  const fixedCode = code.replace(
    /^var \$\$default =[^]*\{((.|\n)*)^}\)/gm
    , 'var $$$$default = {$1};');

  let parsed = loadCsf(fixedCode, { ...opts, fileName: fileName }).parse();

  parsed._stories = mapWithKeys(parsed._stories, (k, v) => [capitalise(k), {
    ...v,
    name: capitalise(v.name)
  }]); // console.log("\n\n\nI parsed", parsed)
  // console.log("\n\n\n")

  return parsed;
};

export default {
  // stories: ["../stories/**/Story/*\.purs"],
  stories: ["../output/Story.*/index\.js"],
  storyIndexers: [{ test: /.*/, indexer: csfIndexer }],
  framework: {
    "name": "@storybook/react-webpack5",
    "options": {}
  },
  staticDirs: ["../."],
  // addons: ["../../storybook-addon-purescript-react-basic"],
  core: { builder: `webpack5` },
  // webpackFinal: async config => {
  // config.resolve.extensions = [...(config.resolve.extensions || []), ".purs"];
  // config.module.rules = [...(config.module.rules || []), {
  //   test: /\.purs$/,
  //   use: [{
  //     loader: resolve("/Users/mark/code/purescript-loader/loader.js"),
  //     options: { outputFolder: resolve("./output/") }
  //   }]
  // }];
  // return config;
  // }
};
