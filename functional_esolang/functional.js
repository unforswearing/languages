"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
// >> functional.ts;
// >> implementation of https://esolangs.org/wiki/Functional
var readline_1 = require("readline");
var reserved = [
    "print",
    "printf",
    "set",
    "rem",
    "if",
    "if_else",
    "loop",
    "while",
    "for",
    "function",
    "true",
    "false",
    "equals",
    "not_equals",
    "less_than",
    "less_or_equals",
    "greater_than",
    "greater_or_equals",
];
var language_types = {
    BAREWORD: /(?<!'|\w|")[a-zA-Z0-9]+(?!'|\w|")/im,
    STRINGS: /".*"/gim,
    BLOCKS: /{.*}/gim
};
var grammar = __assign(__assign({}, language_types), { NUMBER: /[0-9]+/gim, BLOCK_START: /\({/gim, BLOCK_END: /}\)/gim, OPERATOR_PRINTF: /%s/gim, PRINT: /print\(.*\)/gim, PRINTF: /printf\(.*\)/gim, SET: /set\(.*\)/gim, REM: /rem\(.*\)/gim, IF: /if\(.*\)/gim, IF_ELSE: /if_else\(.*\)/gim, LOOP: /loop\(.*\)/gim, WHILE: /while\(.*\)/gim, FOR: /for\(.*\)/gim, FUNCTION: /function\(.*\)/gim, BLOCK_CONTENT: /{(\w+)?[a-zA-Z0-9_]+\(.*\)}/gim, TRUE: /true/gim, FALSE: /false/gim, EQUALS: /equals\(.*\)/gim, NOT_EQUALS: /not_equals\(.*\)/gim, LESS_THAN: /less_than\(.*\)/gim, LESS_OR_EQUALS: /less_or_equals\(.*\)/gim, GREATER_THAN: /greater_than\(.*\)/gim, GREATER_OR_EQUALS: /greater_or_equals\(.*\)/gim, USER_VAR_OR_FUNCTION: /[a-zA-Z0-9_]+\(.*\)/gim });
var LANGUAGE = {
    RUNTIME: {},
    STD_LIB: {},
    RUNTIME_VARS: {},
    OPERATORS: {},
    RESERVED: [],
    FORBIDDEN: [],
    GRAMMAR: {}
};
LANGUAGE.RESERVED = reserved;
// not sure if this is neded with "invalid" in tokenizer
LANGUAGE.FORBIDDEN = [];
LANGUAGE.GRAMMAR = grammar;
var typesetVariable = function (variable) {
    var tmp = variable;
    tmp.isForbidden = isForbidden(variable);
    tmp.isReserved = isReserved(variable);
    if (tmp.isReserved || tmp.isForbidden)
        tmp = undefined;
    return tmp;
};
var isReserved = function (token) {
    return Boolean(LANGUAGE.RESERVED.includes(token));
};
var isForbidden = function (token) {
    return Boolean(LANGUAGE.FORBIDDEN.includes(token));
};
var getVar = function (varname) {
    return LANGUAGE.RUNTIME_VARS[varname];
};
var setVar = function (varname, value) {
    LANGUAGE.RUNTIME_VARS[varname] = value;
    return value;
};
var functionDeclaration = function (name, argBodyObj) { };
var consumeLoopBlock = function (loopFunction) {
    var stringFunction = loopFunction.toString();
    var block_start = grammar.BLOCK_START;
    var block_end = grammar.BLOCK_END;
    if (block_start.test(stringFunction) || block_end.test(stringFunction)) {
        // consume multiline block content
        return;
    }
};
var stdlib = {
    print: function (variable) {
        console.log(variable);
    },
    printf: function (string, variable) {
        console.log(string.replace(grammar.OPERATOR_PRINTF, variable));
    },
    set: function (variable, value) {
        var tmp = typesetVariable(variable);
        if (tmp.isForbidden || tmp.isReserved) {
            console.log("\"" + variable + "\" is a reserved or forbidden item");
            return false;
        }
        setVar(variable, value);
        return value;
    },
    rem: function (string) {
        return Boolean(string);
    },
    nop: function () { return null; },
    "if": function (condition, ifTrue) {
        if (eval(condition)) {
            (function () { return ifTrue; });
        }
        else {
            return false;
        }
    },
    if_else: function (condition, ifTrue, ifFalse) {
        if (eval(condition)) {
            (function () { return ifTrue; });
        }
        else {
            (function () { return ifFalse; });
        }
    },
    loop: function (whileLooping) {
        // parse loop body, could use a grammar for this
    },
    "while": function (condition, whileTrue) {
        while (condition) {
            // parse while body, use a grammar
            return whileTrue;
        }
    },
    "for": function (incrementor, condition, increment, whileFor) { },
    "function": function (name, args, functionBody) {
        functionDeclaration(name, { args: __spreadArray([], args), body: functionBody });
    },
    concat: function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        return items.join(" ");
    },
    input: function (prompt) {
        var rl = readline_1["default"].createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question("prompt", function () {
            rl.close();
        });
        rl.on("close", function () {
            process.exit(0);
        });
    },
    try_catch: function (tryBody, catchbody) { },
    equal: function (a, b) {
        return a === b;
    },
    not_equal: function (a, b) {
        return a !== b;
    },
    less_than: function (a, b) {
        return a < b;
    },
    less_or_equal: function (a, b) {
        return a <= b;
    },
    greater_than: function (a, b) {
        return a > b;
    },
    greater_or_equal: function (a, b) {
        return a >= b;
    }
};
LANGUAGE.STD_LIB = stdlib;
//
var test = "\nprint(\"starting test of functional lang\")\nnop()\nloop({\n  set(thing, \"this is a thing\")\n  print(thing)\n})\n\nfunction(anewfunc, print(\"this is a new function\")\n";
console.log(test.split("\n"));
// const tokenObject = tokenize(, grammar,"INVALID");
// readTokenStream(tokenObject)
