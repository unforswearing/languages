// implmentation of ~/Documents/Computer/Ideas/list-lang.md
/*
---
date created: Friday, July 2nd 2021, 12:45:52 am
date modified: Tuesday, November 16th 2021, 8:01:23 am
---

# list lang

> a language that only uses lists and list methods, an extension of (TS) Arrays

## lists

- lists are arrays that can be used independently of a parent lang
- lists have a subset of Array methods and additional helper functions

### operators

`+` : create a new list


+newList: List()

+newList.idx            - default index value available in all list functions
        .def            - value at index in the list available in all list functions
## List methods

- all methods are also available as standalone functions

+newList
	.concat()
	.includes()
	.indexOf()
	.map()          - a repeat function
	.push()
	.pop()
	.toString()
	.lock()         - make list immutable
	.subset()       - extract a subset of the array
	.typed()        - return a typed array
	.function()     - a user defined function that operates on the list. always returns a list
	.text()         - various text methods from the String object
	.fromString()   - split a string into a new list
	.when()         - compare two arrays or array items for equality (use as if/then/else)
	.math()         - add / subtract / multiply / divide entire arrays
	.input()           - read text from console into a new list
	.output()          - print a list to console
*/
// @todo set up types / namespaces
const KEYWORDS = ["idx", "list"]
const OPERATORS = ["_", "+"]
const create = (list: string|number) => { return new Array(list) }
const add = (...values) => { values.reduce((a,b)=>a+b,0) }
const sub = (...values) => { values.reduce((a,b)=>a-b,0) }
const mul = (...values) => { values.reduce((a,b)=>a*b,1) }
const div = (...values) => { values.reduce((a,b)=>a/b,1) }
const pow = (left,right) => { left**right }
const mod = (left,right) => { left%right }
const eq = (left,right) => { left === right }
const ne = (left,right) => { left !== right }
const lt = (left,right) => { left < right }
const le = (left,right) => { left <= right }
const gt = (left,right) => { left > right }
const ge = (left,right) => { left >= right }
//const not = (value) => { !value }
//const and = (left, right) => { left | right }
//const or = (left, right) => { left | right }
const METHODS = {
  // A and B are lists
  concat(A:[],B:[]) {
    return A.concat(B)
  },
  // V = value
  includes(A:[],V):Array<any>|boolean {
    if (A.includes(V)) {
      return A[A.indexOf(V)]
    } else {
      return false
    }
  },
  indexof(A:[],V):number|boolean {
    if (A.includes(V)) {
      return A.indexOf(V)
    } else {
      return false
    }
  },
  // E = expression, always a function
  map(A:[],E):Array<any> {
    let collector = []
    for (let i = 0; i < A.length; i++) {
      let V = A[i]
      let mapped = E(V)
      collector.push(mapped)
    }
    return collector
  },
  push(A:[],V):Array<any> {
    A.push(V)
    return A;
  },
  pop(A:[]):string|number {
    return A.pop()
  },
  tostring(A:[]):string {
    return A.toString()
  },
  lock(A:[]) {
    return Object.freeze(A)
  },
  // S is an array
  // list.subset([1,3])
  subset(A:[],S):Array<any> {
    S[1] = S[1]++
    return A.splice(S[0],S[1])
  },
  // T = type: number, string, list (array), func
  // V = array
  typed(T:string,V:[]) {
    let tmp = []
    let typeobj = {
      number(V:number):Array<number> {
        let numlist: number[] = new Array(V)
        return numlist
      },
      string(V:string):Array<string> {
        let strlist: string[] = new Array(V)
        return strlist
      },
      list(V:[]):Array<[]> {
        let listlist: [][] = new Array(V)
        return listlist
      },
      func(V:(arg:any)=>any):Array<any> {
        // the array needs to be typed for functions
        let funclist = new Array(V)
        return funclist
      },
    }
  },
  text(A:[]):Array<string> {
    // string methods for items in the array
    return A
  },
  // S = string
  fromstring(S:string) {
    return S.split(" ")
  },
  when(A:[],B:[]) {
    // compare all values between two arrays for equality
  },
  operate(A:[],B:[]) {
    // add / sub / mul / div / etc two arrays
  },
  output(A:[]) {
    console.log(A)
  },
  input(S:string|number) {
    // read input from console into a new list
  }
}
const concat = METHODS.concat
const includes = METHODS.includes
const indexof = METHODS.indexof
const map = METHODS.map
const push = METHODS.push
const pop = METHODS.pop
const tostring = METHODS.tostring
const lock = METHODS.lock
const subset = METHODS.subset
const typed = METHODS.typed
const fromstring = METHODS.fromstring
const text = METHODS.text
const when = METHODS.when
const operate = METHODS.operate
const input = METHODS.input
const output = METHODS.output