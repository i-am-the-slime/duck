import { languages, editor as editorImpl } from 'monaco-editor/esm/vs/editor/editor.main.js';

self.MonacoEnvironment = {
  getWorkerUrl: function (moduleId, label) {
    if (label === 'json') {
      return './vs/language/json/json.worker.js';
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return './vs/language/css/css.worker.js';
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return './vs/language/html/html.worker.js';
    }
    if (label === 'typescript' || label === 'javascript') {
      return './vs/language/typescript/ts.worker.js';
    }
    return './vs/editor/editor.worker.js';
  }
}

export const editor = () => editorImpl

export const createEditorImpl = options => element => editor => () =>
  editor.create(element, options);

export const getValue = m => () => m.getValue()

export const setValue = v => m => () => m.setValue(v)

export const colorizeImpl = text => languageId => options => m => () =>
  m.colorize(text, languageId, options);

export const defineTheme = editor => (name) => (theme) => () =>
  editor.defineTheme(name, theme);

export const setTheme = (theme) => () =>
  editorImpl.setTheme(theme);

export const layout = m => () => m.layout()

export const registerLanguage = languageId => () => languages.register({ id: languageId });

export const remeasureFonts = editor => () => editor.remeasureFonts()

export const setMonarchTokensProvider = (name) => (monarchLanguage) => () => {
  return languages.setMonarchTokensProvider(
    name,
    monarchLanguage
  );
};

export const horizonTheme = function (bg) {
  return ({
    base: "vs",
    inherit: true,
    rules: [
      {
        foreground: "#33333380",
        fontStyle: "italic",
        token: "comment"
      },
      {
        foreground: "#DC3318",
        token: "constant"
      },
      {
        foreground: "#F77D26",
        token: "entity.name"
      },
      {
        foreground: "#1D8991",
        token: "entity.name.function"
      },
      {
        foreground: "#DA103F",
        token: "entity.name.tag"
      },
      {
        foreground: "#F77D26",
        token: "entity.name.type"
      },
      {
        foreground: "#DA103F",
        token: "variable"
      },
      {
        foreground: "#DA103F",
        token: "entity.name.variable"
      },
      {
        foreground: "#8A31B9",
        token: "keyword"
      },
      {
        foreground: "#333333",
        token: "keyword.operator"
      },
      {
        foreground: "#8A31B9",
        token: "keyword.operator.new"
      },
      {
        foreground: "#8A31B9",
        token: "keyword.operator.expression"
      },
      {
        foreground: "#8A31B9",
        token: "keyword.operator.logical, keyword.operator.delete"
      },
      {
        foreground: "#8A31B9",
        token: "keyword.operator.delete"
      },
      {
        foreground: "#DC3318",
        token: "keyword.other.unit"
      },
      {
        foreground: "#F6661EB3",
        fontStyle: "italic",
        token: "markup.quote"
      },
      {
        foreground: "#DA103F",
        token: "entity.name.section"
      },
      {
        foreground: "#8A31B9",
        token: "storage"
      },
      {
        foreground: "#F6661E",
        token: "string"
      },
      {
        foreground: "#F77D26",
        token: "support"
      },
      {
        foreground: "#1D8991",
        token: "support.function"
      },
      {
        foreground: "#DA103F",
        token: "support.variable"
      },
      {
        foreground: "#DA103F",
        token: "support.type.property-name"
      },
      {
        foreground: "#DA103F",
        token: "meta.object-literal.key"
      },
      {
        foreground: "#333333",
        token: "support.type.property-name.css"
      },
      {
        foreground: "#F77D26",
        fontStyle: "italic",
        token: "variable.language"
      },
      {
        fontStyle: "italic",
        token: "variable.parameter"
      },
      {
        foreground: "#DA103FB3",
        token: "punctuation.definition.tag"
      },
      {
        foreground: "#333333",
        token: "punctuation.separator"
      },
    ],
    colors: {
      "editor.foreground": "#000000",
      "editor.background": bg, //"#FDF0ED"
      "editor.selectionBackground": "#F9CBBE80",
      "editor.lineHighlightBackground": "#B5D5FF",
      "editor.lineHighlightBorder": "#B5D5FF",
      "editorCursor.foreground": "#333333",
      "editorWhitespace.foreground": "#BFBFBF",
    },
  })
}

export const nightOwlTheme = (bg) => ({
  base: "vs-dark",
  inherit: true,
  rules: [
    {
      foreground: "637777",
      token: "comment",
    },
    {
      foreground: "addb67",
      token: "string",
    },
    {
      foreground: "ecc48d",
      token: "vstring.quoted",
    },
    {
      foreground: "ecc48d",
      token: "variable.other.readwrite.js",
    },
    {
      foreground: "5ca7e4",
      token: "string.regexp",
    },
    {
      foreground: "5ca7e4",
      token: "string.regexp keyword.other",
    },
    {
      foreground: "5f7e97",
      token: "meta.function punctuation.separator.comma",
    },
    {
      foreground: "f78c6c",
      token: "constant.numeric",
    },
    {
      foreground: "f78c6c",
      token: "constant.character.numeric",
    },
    {
      foreground: "addb67",
      token: "variable",
    },
    {
      foreground: "c792ea",
      token: "keyword",
    },
    {
      foreground: "c792ea",
      token: "punctuation.accessor",
    },
    {
      foreground: "c792ea",
      token: "storage",
    },
    {
      foreground: "c792ea",
      token: "meta.var.expr",
    },
    {
      foreground: "c792ea",
      token:
        "meta.class meta.method.declaration meta.var.expr storage.type.jsm",
    },
    {
      foreground: "c792ea",
      token: "storage.type.property.js",
    },
    {
      foreground: "c792ea",
      token: "storage.type.property.ts",
    },
    {
      foreground: "c792ea",
      token: "storage.type.property.tsx",
    },
    {
      foreground: "82aaff",
      token: "storage.type",
    },
    {
      foreground: "ffcb8b",
      token: "entity.name.class",
    },
    {
      foreground: "ffcb8b",
      token: "meta.class entity.name.type.class",
    },
    {
      foreground: "addb67",
      token: "entity.other.inherited-class",
    },
    {
      foreground: "82aaff",
      token: "entity.name.function",
    },
    {
      foreground: "addb67",
      token: "punctuation.definition.variable",
    },
    {
      foreground: "d3423e",
      token: "punctuation.section.embedded",
    },
    {
      foreground: "d6deeb",
      token: "punctuation.terminator.expression",
    },
    {
      foreground: "d6deeb",
      token: "punctuation.definition.arguments",
    },
    {
      foreground: "d6deeb",
      token: "punctuation.definition.array",
    },
    {
      foreground: "d6deeb",
      token: "punctuation.section.array",
    },
    {
      foreground: "d6deeb",
      token: "meta.array",
    },
    {
      foreground: "d9f5dd",
      token: "punctuation.definition.list.begin",
    },
    {
      foreground: "d9f5dd",
      token: "punctuation.definition.list.end",
    },
    {
      foreground: "d9f5dd",
      token: "punctuation.separator.arguments",
    },
    {
      foreground: "d9f5dd",
      token: "punctuation.definition.list",
    },
    {
      foreground: "d3423e",
      token: "string.template meta.template.expression",
    },
    {
      foreground: "d6deeb",
      token: "string.template punctuation.definition.string",
    },
    {
      foreground: "c792ea",
      fontStyle: "italic",
      token: "italic",
    },
    {
      foreground: "addb67",
      fontStyle: "bold",
      token: "bold",
    },
    {
      foreground: "82aaff",
      token: "constant.language",
    },
    {
      foreground: "82aaff",
      token: "punctuation.definition.constant",
    },
    {
      foreground: "82aaff",
      token: "variable.other.constant",
    },
    {
      foreground: "7fdbca",
      token: "support.function.construct",
    },
    {
      foreground: "7fdbca",
      token: "keyword.other.new",
    },
    {
      foreground: "82aaff",
      token: "constant.character",
    },
    {
      foreground: "82aaff",
      token: "constant.other",
    },
    {
      foreground: "f78c6c",
      token: "constant.character.escape",
    },
    {
      foreground: "addb67",
      token: "entity.other.inherited-class",
    },
    {
      foreground: "d7dbe0",
      token: "variable.parameter",
    },
    {
      foreground: "7fdbca",
      token: "entity.name.tag",
    },
    {
      foreground: "cc2996",
      token: "punctuation.definition.tag.html",
    },
    {
      foreground: "cc2996",
      token: "punctuation.definition.tag.begin",
    },
    {
      foreground: "cc2996",
      token: "punctuation.definition.tag.end",
    },
    {
      foreground: "addb67",
      token: "entity.other.attribute-name",
    },
    {
      foreground: "addb67",
      token: "entity.name.tag.custom",
    },
    {
      foreground: "82aaff",
      token: "support.function",
    },
    {
      foreground: "82aaff",
      token: "support.constant",
    },
    {
      foreground: "7fdbca",
      token: "upport.constant.meta.property-value",
    },
    {
      foreground: "addb67",
      token: "support.type",
    },
    {
      foreground: "addb67",
      token: "support.class",
    },
    {
      foreground: "addb67",
      token: "support.variable.dom",
    },
    {
      foreground: "7fdbca",
      token: "support.constant",
    },
    {
      foreground: "7fdbca",
      token: "keyword.other.special-method",
    },
    {
      foreground: "7fdbca",
      token: "keyword.other.new",
    },
    {
      foreground: "7fdbca",
      token: "keyword.other.debugger",
    },
    {
      foreground: "7fdbca",
      token: "keyword.control",
    },
    {
      foreground: "c792ea",
      token: "keyword.operator.comparison",
    },
    {
      foreground: "c792ea",
      token: "keyword.control.flow.js",
    },
    {
      foreground: "c792ea",
      token: "keyword.control.flow.ts",
    },
    {
      foreground: "c792ea",
      token: "keyword.control.flow.tsx",
    },
    {
      foreground: "c792ea",
      token: "keyword.control.ruby",
    },
    {
      foreground: "c792ea",
      token: "keyword.control.module.ruby",
    },
    {
      foreground: "c792ea",
      token: "keyword.control.class.ruby",
    },
    {
      foreground: "c792ea",
      token: "keyword.control.def.ruby",
    },
    {
      foreground: "c792ea",
      token: "keyword.control.loop.js",
    },
    {
      foreground: "c792ea",
      token: "keyword.control.loop.ts",
    },
    {
      foreground: "c792ea",
      token: "keyword.control.import.js",
    },
    {
      foreground: "c792ea",
      token: "keyword.control.import.ts",
    },
    {
      foreground: "c792ea",
      token: "keyword.control.import.tsx",
    },
    {
      foreground: "c792ea",
      token: "keyword.control.from.js",
    },
    {
      foreground: "c792ea",
      token: "keyword.control.from.ts",
    },
    {
      foreground: "c792ea",
      token: "keyword.control.from.tsx",
    },
    {
      foreground: "ffffff",
      background: "ff2c83",
      token: "invalid",
    },
    {
      foreground: "ffffff",
      background: "d3423e",
      token: "invalid.deprecated",
    },
    {
      foreground: "7fdbca",
      token: "keyword.operator",
    },
    {
      foreground: "c792ea",
      token: "keyword.operator.relational",
    },
    {
      foreground: "c792ea",
      token: "keyword.operator.assignement",
    },
    {
      foreground: "c792ea",
      token: "keyword.operator.arithmetic",
    },
    {
      foreground: "c792ea",
      token: "keyword.operator.bitwise",
    },
    {
      foreground: "c792ea",
      token: "keyword.operator.increment",
    },
    {
      foreground: "c792ea",
      token: "keyword.operator.ternary",
    },
    {
      foreground: "637777",
      token: "comment.line.double-slash",
    },
    {
      foreground: "cdebf7",
      token: "object",
    },
    {
      foreground: "ff5874",
      token: "constant.language.null",
    },
    {
      foreground: "d6deeb",
      token: "meta.brace",
    },
    {
      foreground: "c792ea",
      token: "meta.delimiter.period",
    },
    {
      foreground: "d9f5dd",
      token: "punctuation.definition.string",
    },
    {
      foreground: "ff5874",
      token: "constant.language.boolean",
    },
    {
      foreground: "ffffff",
      token: "object.comma",
    },
    {
      foreground: "7fdbca",
      token: "variable.parameter.function",
    },
    {
      foreground: "80cbc4",
      token: "support.type.vendor.property-name",
    },
    {
      foreground: "80cbc4",
      token: "support.constant.vendor.property-value",
    },
    {
      foreground: "80cbc4",
      token: "support.type.property-name",
    },
    {
      foreground: "80cbc4",
      token: "meta.property-list entity.name.tag",
    },
    {
      foreground: "57eaf1",
      token: "meta.property-list entity.name.tag.reference",
    },
    {
      foreground: "f78c6c",
      token: "constant.other.color.rgb-value punctuation.definition.constant",
    },
    {
      foreground: "ffeb95",
      token: "constant.other.color",
    },
    {
      foreground: "ffeb95",
      token: "keyword.other.unit",
    },
    {
      foreground: "c792ea",
      token: "meta.selector",
    },
    {
      foreground: "fad430",
      token: "entity.other.attribute-name.id",
    },
    {
      foreground: "80cbc4",
      token: "meta.property-name",
    },
    {
      foreground: "c792ea",
      token: "entity.name.tag.doctype",
    },
    {
      foreground: "c792ea",
      token: "meta.tag.sgml.doctype",
    },
    {
      foreground: "d9f5dd",
      token: "punctuation.definition.parameters",
    },
    {
      foreground: "ecc48d",
      token: "string.quoted",
    },
    {
      foreground: "ecc48d",
      token: "string.quoted.double",
    },
    {
      foreground: "ecc48d",
      token: "string.quoted.single",
    },
    {
      foreground: "addb67",
      token: "support.constant.math",
    },
    {
      foreground: "addb67",
      token: "support.type.property-name.json",
    },
    {
      foreground: "addb67",
      token: "support.constant.json",
    },
    {
      foreground: "c789d6",
      token: "meta.structure.dictionary.value.json string.quoted.double",
    },
    {
      foreground: "80cbc4",
      token: "string.quoted.double.json punctuation.definition.string.json",
    },
    {
      foreground: "ff5874",
      token:
        "meta.structure.dictionary.json meta.structure.dictionary.value constant.language",
    },
    {
      foreground: "d6deeb",
      token: "variable.other.ruby",
    },
    {
      foreground: "ecc48d",
      token: "entity.name.type.class.ruby",
    },
    {
      foreground: "ecc48d",
      token: "keyword.control.class.ruby",
    },
    {
      foreground: "ecc48d",
      token: "meta.class.ruby",
    },
    {
      foreground: "7fdbca",
      token: "constant.language.symbol.hashkey.ruby",
    },
    {
      foreground: "e0eddd",
      background: "a57706",
      fontStyle: "italic",
      token: "meta.diff",
    },
    {
      foreground: "e0eddd",
      background: "a57706",
      fontStyle: "italic",
      token: "meta.diff.header",
    },
    {
      foreground: "ef535090",
      fontStyle: "italic",
      token: "markup.deleted",
    },
    {
      foreground: "a2bffc",
      fontStyle: "italic",
      token: "markup.changed",
    },
    {
      foreground: "a2bffc",
      fontStyle: "italic",
      token: "meta.diff.header.git",
    },
    {
      foreground: "a2bffc",
      fontStyle: "italic",
      token: "meta.diff.header.from-file",
    },
    {
      foreground: "a2bffc",
      fontStyle: "italic",
      token: "meta.diff.header.to-file",
    },
    {
      foreground: "219186",
      background: "eae3ca",
      token: "markup.inserted",
    },
    {
      foreground: "d3201f",
      token: "other.package.exclude",
    },
    {
      foreground: "d3201f",
      token: "other.remove",
    },
    {
      foreground: "269186",
      token: "other.add",
    },
    {
      foreground: "ff5874",
      token: "constant.language.python",
    },
    {
      foreground: "82aaff",
      token: "variable.parameter.function.python",
    },
    {
      foreground: "82aaff",
      token: "meta.function-call.arguments.python",
    },
    {
      foreground: "b2ccd6",
      token: "meta.function-call.python",
    },
    {
      foreground: "b2ccd6",
      token: "meta.function-call.generic.python",
    },
    {
      foreground: "d6deeb",
      token: "punctuation.python",
    },
    {
      foreground: "addb67",
      token: "entity.name.function.decorator.python",
    },
    {
      foreground: "8eace3",
      token: "source.python variable.language.special",
    },
    {
      foreground: "82b1ff",
      token: "markup.heading.markdown",
    },
    {
      foreground: "c792ea",
      fontStyle: "italic",
      token: "markup.italic.markdown",
    },
    {
      foreground: "addb67",
      fontStyle: "bold",
      token: "markup.bold.markdown",
    },
    {
      foreground: "697098",
      token: "markup.quote.markdown",
    },
    {
      foreground: "80cbc4",
      token: "markup.inline.raw.markdown",
    },
    {
      foreground: "ff869a",
      token: "markup.underline.link.markdown",
    },
    {
      foreground: "ff869a",
      token: "markup.underline.link.image.markdown",
    },
    {
      foreground: "d6deeb",
      token: "string.other.link.title.markdown",
    },
    {
      foreground: "d6deeb",
      token: "string.other.link.description.markdown",
    },
    {
      foreground: "82b1ff",
      token: "punctuation.definition.string.markdown",
    },
    {
      foreground: "82b1ff",
      token: "punctuation.definition.string.begin.markdown",
    },
    {
      foreground: "82b1ff",
      token: "punctuation.definition.string.end.markdown",
    },
    {
      foreground: "82b1ff",
      token: "meta.link.inline.markdown punctuation.definition.string",
    },
    {
      foreground: "7fdbca",
      token: "punctuation.definition.metadata.markdown",
    },
    {
      foreground: "82b1ff",
      token: "beginning.punctuation.definition.list.markdown",
    },
  ],
  colors: {
    "editor.foreground": "#d6deeb",
    //    "editor.background": "#011627",
    "editor.background": bg,
    "editor.selectionBackground": "#5f7e9779",
    "editor.lineHighlightBackground": "#010E17",
    "editorCursor.foreground": "#80a4c2",
    "editorWhitespace.foreground": "#2e2040",
    "editorIndentGuide.background": "#5e81ce52",
    "editor.selectionHighlightBorder": "#122d42",
  },
});

export const purescriptSyntax = {
  displayName: "Purescript",
  name: "purescript",
  mimeTypes: ["text/purescript"],
  fileExtensions: ["purs"],

  editorOptions: { tabSize: 2, insertSpaces: true },

  lineComment: "--",
  blockCommentStart: "{-",
  blockCommentEnd: "-}",

  keywords: [
    "case",
    "class",
    "data",
    "derive",
    "do",
    "ado",
    "else",
    "if",
    "import",
    "in",
    "infix",
    "infixl",
    "infixr",
    "instance",
    "let",
    "module",
    "newtype",
    "of",
    "then",
    "type",
    "where",
    "->",
    "|",
    "=>",
    "::",
    "\\",
    "=",
    "|",
    "foreign",
    "forall",
    "∷",
    "∀",
  ],

  extraKeywords: [],

  typeKeywords: [],

  dataStart: ["^data"],

  typeStart: ["class", "instance", "type", "derive"],

  escapes:
    "\\\\(?:[nrt\\\\\"'\\?]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|U[0-9a-fA-F]{6})",
  symbols0: "[\\$%&\\*\\+@!\\/\\\\\\^~=\\.:\\-\\?]",
  symbols: "(?:@symbols0|[\\|<>])+",
  idchars: "(?:[\\w'])*",

  tokenizer: {
    root: [
      [
        "((?:[A-Z]@idchars\\.)+)([a-z]@idchars)",
        ["identifier.namespace", "identifier"],
      ],
      [
        "((?:[A-Z]@idchars\\.)+)([A-Z]@idchars)",
        ["identifier.namespace", "constructor"],
      ],

      [
        "[a-z]@idchars(?!\\.)",
        {
          cases: {
            "@dataStart": { token: "keyword", next: "@type_data" },
            "@typeStart": { token: "keyword", next: "@type_type" },
            "@keywords": "keyword",
            "@extraKeywords": "keyword",
            "@default": "identifier",
          },
        },
      ],

      ["[A-Z]@idchars", "type.identifier"],

      ["_@idchars", "identifier.wildcard"],

      ["([a-z]@idchars\\.)+", "identifier.namespace"],

      { include: "@whitespace" },

      ["[{}()\\[\\]]", "@brackets"],
      ["[,`]", "delimiter"],

      ["::(?!@symbols0)", "type.operator", "@type_line"],
      [
        "@symbols",
        {
          cases: {
            "@keywords": "keyword.operator",
            "@extraKeywords": "keyword.operator",
            "@default": "operator",
          },
        },
      ],

      ["[0-9]+\\.[0-9]+([eE][\\-+]?[0-9]+)?", "number.float"],
      ["0[xX][0-9a-fA-F]+", "number.hex"],
      ["[0-9]+", "number"],

      ['"([^"\\\\]|\\\\.)*$', "string.invalid"],
      ['"', { token: "string.quote", bracket: "@open", next: "@string" }],

      ["'[^\\\\']'", "string"],
      ["(')(@escapes)(')", ["string", "string.escape", "string"]],
      ["'", "string.invalid"],

      ["^[ ]*#.*", "namespace"],
    ],

    whitespace: [
      ["[ \\r\\n]+", ""],
      ["{-", "comment", "@comment"],
      ["--.*$", "comment"],
    ],

    comment: [
      ["[^\\{\\-]+", "comment"],
      ["{-", "comment", "@push"],
      ["-}", "comment", "@pop"],
      ["[\\{\\-]", "comment"],
    ],

    string: [
      ['[^\\\\"]+', "string"],
      ["@escapes", "string.escape"],
      ["\\\\.", "string.escape.invalid"],
      ['"', { token: "string.quote", bracket: "@close", next: "@pop" }],
    ],

    type_type: [
      ["\\=", "keyword"],
      ["^\\s*(?!\\-\\-|\\{\\-)[^\\s]", { token: "@rematch", next: "@pop" }],
      { include: "@type" },
    ],

    type_data: [
      ["([=|])(\\s*)([A-Z]@idchars)", ["keyword.operator", "", "constructor"]],
      ["^\\s*$", { token: "", next: "@pop" }],
      { include: "@type" },
    ],

    type_line: [
      ["^\\s*(?!\\-\\-|\\{\\-)[_a-z]", { token: "@rematch", next: "@pop" }],
      ["[^=]*=", { token: "@rematch", next: "@pop" }],
      { include: "@type" },
    ],

    type: [
      ["[(\\[]", { token: "@brackets.type" }, "@type_nested"],
      { include: "@type_content" },
    ],

    type_nested: [
      ["[)\\]]", { token: "@brackets.type" }, "@pop"],
      ["[(\\[]", { token: "@brackets.type" }, "@push"],
      [",", "delimiter.type"],
      { include: "@type_content" },
    ],

    type_content: [
      { include: "@whitespace" },

      ["[a-z]\\d*\\b", "type.identifier.typevar"],
      ["_@idchars", "type.identifier.typevar"],

      [
        "((?:[A-Z]@idchars\\.)*)([A-Z]@idchars)",
        ["type.identifier.namespace", "type.identifier"],
      ],
      [
        "((?:[A-Z]@idchars\\.)*)([a-z]@idchars)",
        {
          cases: {
            "@typeKeywords": ["type.identifier.namespace", "type.keyword"],
            "@keywords": { token: "@rematch", next: "@pop" },
            "@default": ["type.identifier.namespace", "type.identifier"],
          },
        },
      ],

      ["::|->|[\\.:|]", "type.operator"],
      ["[\\s\\S]", "@rematch", "@pop"],
    ],
  },
};