 // syntax regex

const primitiveRegex = {
  CODE_BLOCK: /::/,
  COMMENT: /%/,
  FALSE: /false/,
  LIST_END: /\)/,
  LIST_ITEM: /,/,
  LIST_METHOD: /\.\w+/,
  LIST_START: /\(/,
  NUMBER: /^\d+\b/,
  STRING: /^"([^"]*)"/,
  TRUE: /true/,
  VARIABLE_DECL: /\#\w+(?!=\()/,
  WHITESPACE: /\s+/,
  WORD: /w+/,
};

const operatorRegex = {
  ADD: /\+/,
  BOOL_EQ: /===/,
  BOOL_NE: /!==/,
  BOOL_LT: /</,
  BOOL_GT: />/,
  BOOL_LE: /<=/,
  BOOL_GE: />=/,
  BUILTIN: /@\w+/,
  DIVIDE: /\//,
  MULTIPLY: /\*/,
  SUBTRACT: /-/,
};

const syntaxRegex = {
  ...operatorRegex,
  ...primitiveRegex,
};

// tokenizer
/*
 * Tiny tokenizer
 * https://gist.github.com/borgar/451393/7698c95178898c9466214867b46acb2ab2f56d68
 *
 * - Accepts a subject string and an object of regular expressions for parsing
 * - Returns an array of token objects
 *
 * tokenize('this is text.', { word:/\w+/, whitespace:/\s+/, punctuation:/[^\w\s]/ }, 'invalid');
 * result => [{ token="this", type="word" },{ token=" ", type="whitespace" }, Object { token="is", type="word" }, ... ]
 *
 */
function tokenize(s: string, parsers: Object, deftok: string) {
  var m,
    r,
    l,
    t,
    tokens = [];
  while (s) {
    t = null;
    m = s.length;
    for (var key in parsers) {
      r = parsers[key].exec(s);
      // try to choose the best match if there are several
      // where "best" is the closest to the current starting point
      if (r && r.index < m) {
        t = {
          token: r[0],
          type: key,
          matches: r.slice(1),
        };
        m = r.index;
      }
    }
    if (m) {
      // there is text between last token and currently
      // matched token - push that out as default or "unknown"
      tokens.push({
        token: s.substr(0, m),
        type: deftok || "unknown",
      });
    }
    if (t) {
      // push current token onto sequence
      tokens.push(t);
    }
    s = s.substr(m + (t ? t.token.length : 0));
  }
  return tokens;
}

/*
let testExpr = `
  #item(true)
  @when(#item === true) 
    :: "then block"
    :: "else block"
`

let testRes = tokenize(testExpr, syntaxRegex, 'INVALID')

console.log(testRes)
*/

// types
//...

// functions

function readTokenStream(token) {}

function readVariable(token) {
  // this will match any VARIABLE_DECL
  // the the value doesn't exist in the global
  // language object, add it. if it does exist, retrieve it and return the value for token
}

let _LANG = {
  RUNTIME: {
    variables: { name: "", value: "" },
    functions: { name: "", value: "" },
    lists: { name: "", value: "" },
  },
  METHODS: {
    when: (expression: string): Boolean => {
      return;
    },
    math: (expression: Number): Number | Boolean => {
      return;
    },
    list: (expression?: string | any): Object => {
      return {};
    },
    text: {
      rpl: (str: string, replacer?: string): string => {
        return;
      },
    },
    in: (value: any): any => {
      return;
    },
    out: (value: any): any => {
      return;
    },
    shell: (expression: string): string => {
      return "";
    },
  },
  CORE: {
    primitives: primitiveRegex,
    operators: operatorRegex,
  },
};

_LANG.METHODS["when"] = (comparison) => {
  if (comparison.length > 1) {
    // throw function error
  }

  // parse variables
  // use tokenizer to split the sring and then
  // replace the variables so the expression
  // can be evaluated.

  // @todo need to safely evaluate math
  let expression: Boolean = eval(comparison[0]);
  return expression;
};

_LANG.METHODS["math"] = (expression: Number): Number | Boolean => {
  if (expression) {
    // throw function error
  }

  // parse variables
  // use tokenizer to split the sring and then
  // replace the variables so the expression
  // can be evaluated.

  // @todo need to safely evaluate math
  let evaluated: Number = eval(expression.toString());

  return 0;
};

// parser
const insert = (value: any, index?: Number): Array<any> => {
  return [];
};
const extract = (value: any, index?: Number): Array<any> => {
  return [];
};
const eachitem = () => {};
const fromlist = (item: string): Array<string> => {
  return [];
};

_LANG.METHODS["list"] = (items?: any) => {
  if (!items) return [];

  return {
    ins: insert,
    ext: extract,
    each: eachitem,
    from: fromlist,
  };
};

const replace = (str: string, replacer?: string): string => {
  return;
};
_LANG.METHODS["text"].rpl = replace;
_LANG.METHODS["in"] = (val: any) => {
  return;
};
_LANG.METHODS["out"] = (val: any) => {
  return;
};
_LANG.METHODS["shell"] = (expr: string): string => {
  return;
};

/*
const LANGUAGE = {
  ..._LANG,
};
*/

/*
let testRes = tokenize(testExpr, syntaxRegex, 'INVALID')
*/
