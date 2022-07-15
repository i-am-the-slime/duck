import esbuild from "esbuild"
import path from "path";
import { fileURLToPath } from 'url';
import { cpSync, rmdirSync, mkdirSync, writeFileSync } from "fs"

rmdirSync("dist", { recursive: true })
mkdirSync("dist")
writeFileSync("dist/package.json", JSON.stringify({ main: "script.js" }))
cpSync("index.html", "dist/index.html")

function build(opts) {
  esbuild.build(opts).then((result) => {
    if (result.errors.length > 0) {
      console.error(result.errors);
    }
    if (result.warnings.length > 0) {
      console.error(result.warnings);
    }
  });
}

const workerEntryPoints = [
  'vs/language/json/json.worker.js',
  'vs/language/css/css.worker.js',
  'vs/language/html/html.worker.js',
  'vs/language/typescript/ts.worker.js',
  'vs/editor/editor.worker.js'
];

const outdir = path.dirname(fileURLToPath(import.meta.url))

build({
  entryPoints: workerEntryPoints.map((entry) => `node_modules/monaco-editor/esm/${entry}`),
  bundle: true,
  format: 'iife',
  outbase: './node_modules/monaco-editor/esm/',
  outdir,
  loader: {
    ".png": "file",
    ".ttf": "file",
    ".css": "css",
  },
});

build({
  entryPoints: ['renderer.mjs'],
  bundle: true,
  sourcemap: true,
  outdir: 'dist',
  loader: {
    ".png": "file",
    ".ttf": "file",
    ".css": "css",
  },
})

build({
  entryPoints: ['script.mjs'],
  bundle: true,
  sourcemap: true,
  platform: 'node',
  target: 'node16.15',
  outdir: 'dist',
  external: ['electron'],
})