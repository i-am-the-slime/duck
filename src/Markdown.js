import { marked as markedImpl } from "marked"
export { sanitize } from "dompurify"
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';

// Vendored from ry-blocks for now
var purescript = function (hljs) {
  var COMMENT = {
    variants: [
      hljs.COMMENT("--", "$"),
      hljs.COMMENT("{-", "-}", {
        contains: ["self"]
      })
    ]
  }
  var ESCAPED_KEY = {
    className: "attribute",
    begin: '"',
    illegal: '"',
    end: '"',
    relevance: 0
  }
  // var KEY = {
  //   className: "attribute",
  //   begin: "[a-z]",
  //   illegal: ""
  //   end: "(::|∷)",
  //   excludeEnd: true,
  //   relevance: 0,
  // };
  var CONSTRUCTOR = {
    className: "type",
    begin: "\\b[A-Z][\\w']*",
    relevance: 0
  }
  var LIST = {
    begin: "\\(",
    end: "\\)",
    illegal: '"',
    contains: [
      { className: "type", begin: "\\b[A-Z][\\w]*(\\((\\.\\.|,|\\w+)\\))?" },
      hljs.inherit(hljs.TITLE_MODE, { begin: "[_a-z][\\w']*" }),
      COMMENT
    ]
  }
  var VALUE = {}
  var KEY_VALUE = {
    className: "attribute",
    begin: "\\w+",
    end: ",|}",
    contains: [VALUE]
  }
  var RECORD = {
    begin: "{",
    end: "}",
    contains: [KEY_VALUE]
  }
  return {
    name: "PureScript",
    aliases: ["purs", "purescript"],
    keywords: {
      keyword:
        "case " +
        "class " +
        "data " +
        "derive " +
        "ado " +
        "do " +
        "else " +
        "if " +
        "import " +
        "in " +
        "infix " +
        "infixl " +
        "infixr " +
        "instance " +
        "let " +
        "module " +
        "newtype " +
        "of " +
        "then " +
        "type " +
        "where " +
        ": " +
        "foreign " +
        "forall " +
        "∀"
    },
    contains: [
      // Top-level constructions.
      {
        beginKeywords: "module",
        end: "where",
        keywords: "module where",
        contains: [LIST, COMMENT],
        illegal: "\\W\\.|;"
      },
      {
        begin: "\\bimport\\b",
        end: "$",
        keywords: "import as hiding",
        contains: [LIST, COMMENT],
        illegal: "\\W\\.|;"
      },
      {
        className: "class",
        begin: "^(\\s*)?(class|instance)\\b",
        end: "where",
        keywords: "class instance where",
        contains: [CONSTRUCTOR, LIST, COMMENT]
      },
      {
        className: "class",
        begin: "\\b(data|(new)?type)\\b",
        end: "$",
        keywords: "data family type newtype derive",
        contains: [CONSTRUCTOR, LIST, RECORD, COMMENT]
      },
      {
        className: "symbol",
        begin: "=|<-|->|\\:\\:|\\\\|=>|<=|forall|∀|\\:|::|∷|{|}|\\(|\\)|\\[|\\]|,",
        invalid: "/"
      },
      {
        beginKeywords: "default",
        end: "$",
        contains: [CONSTRUCTOR, LIST, COMMENT]
      },
      {
        beginKeywords: "infix infixl infixr",
        end: "$",
        contains: [hljs.C_NUMBER_MODE, COMMENT]
      },
      {
        begin: "\\bforeign\\b",
        end: "$",
        keywords: "foreign import",
        contains: [CONSTRUCTOR, hljs.QUOTE_STRING_MODE, COMMENT]
      },
      // "Whitespaces".
      // Literals and names.
      // TODO: characters.
      hljs.QUOTE_STRING_MODE,
      hljs.C_NUMBER_MODE,
      CONSTRUCTOR,
      hljs.inherit(hljs.TITLE_MODE, { begin: "^[_a-z][\\w']*" }),
      COMMENT,
      { begin: "->|<-" }
    ]
  }
}
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('purescript', purescript);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('xml', xml);

// All this crap
const renderer = new markedImpl.Renderer();
const linkRenderer = renderer.link;
renderer.link = (href, title, text) => {
  const isLocalLink = href.startsWith(`${location.protocol}//${location.hostname}`);
  const html = linkRenderer.call(renderer, href, title, text);
  // return isLocalLink ? html : html.replace(/^<a /, `<a target="_blank" rel="noreferrer noopener nofollow" `);
  return html.replace(/^<a /, `<a target="_blank" rel="noreferrer noopener nofollow" `);
};

export const marked = str => markedImpl(str, {
  renderer,
  highlight: function (code, lang) {
    if (lang === "purescript" || lang === "javascript" || lang === "js" || lang === "html" || lang == "xml") {
      return hljs.highlight(code, { language: lang }).value;
    }
    return code;
  }
})