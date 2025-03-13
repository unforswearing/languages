> reng 
>>> A restricted command langauge for light scripting
>>> Inspired by Javascript, Lua, and old imperative languages
>>> Created with Typescript

> planned interpreter schema
>>> script.reng -> typescript interpreter -> code execution

> possible compilation schema:
>>> script.reng -> typescript interpeter -> typescriptToLua* compiler -> lua binary

---

@reminder see todo items in the individual files!

@done? make sure the spec matches the code, vice versa
@in-progress test tokenizer 
@todo write code to run interpreted commands based on tokens
@todo write test cases via Jasmine for each function
@todo write a main.ts file that can be the runner for the rset of this
@todo write a simple cli to interpret files
@done make sure everything that can be removed is removed
  - removed some extraneous commands, this is as simple as i can get rn
@dropped merge functs, types into core.ts
  - this isn't necessary
@done revise the type interfaces / classes so they can be used with functions
  - dropping interfaces / classes for simplicity
@done write a sample file that covers all features
  - /Users/unforswearing/Documents/__Github/reng_lang/docs/example.reng
---

## limitations

- no if / then / else
- no list iteration
- no keywords
- no multiline statements
- everything is text
  - all text / strings must be quoted.
  - quoting numbers is not necessary
- no nesting commands, only chaining
  - @function() : @next() : @etc()


## etc

- all whitespace is ignored
- dynamically typed
  - types are implicitly converted from text in comparison/math/text functions
    - manually catching typeError 
      -> check type of arg 
      -> convert to required type
  - there is internal typing, this is not exposed to the language
- functions are set and called using @ symbol
- nesting is only allowed for lists
- every command can be chained to a similar command
  - lists and i/o commands cannot be chained 
  - this will work: @add() : @mul() : @div()
  - this will not work: @add() : @ins() : @rpl()

## syntax

### operators

- six operators:

```

>    comment
=    assignment
:    pipe operator
#    variable assignment and reference
@    function declaration / call and variable placeholder (piping)
%    shell commands

```

> all other operators are treated as invalid and with throw errors

### comments

- all comments start with ">" greater-than symbol
- comments must be on their own line -- no comments after commands

- (example)

### boolean

- true and false.

### variables

- variable names must be prefixed with the hash # when creating or referencing

- #varname="value"                     > assign a string to varname
- #varname=@funcname(arg)              > @ is used for function calls
                                       > and variable placeholders with chaining 
- #varname=@add(2,5)                   > simple math function value
- #varname={1,3,5,7}                   > set varname to list
- #varname=@rpl("hello", "ell", "ih)   > string replacement, rets "hiho"

### control

#### chaining

- chaining is the only way to allow commands to interact 
  - functions cannot be nested as arguments in other functions
  - math / comparisons cannot be used inside an if function
  - all nested functions are considered invalid
- chaining can be used for most functions, and is especially helpful for comparisons
- chaning can be used with all similar functions, except list and io
  - there is only one if statment, which can be chained with other comparisons

- chaning is similar to piping in the shell:
  - "command | fn_something $(cat -) $arg2 | ... "
- use the : operator to chain commands (similar to the pipe char "|")
- use the @ operator to act as the return value from the previous function
- example
  - @add(#num, 2) : @mul(@, 3)
  - whitespace is ignored

- lists and i/o functions can only be chained to themselves and not to other functions

#### comparison

- no if/then/else statements.
  - the @is() function serves a similar purpose 
- comparisons can be made using the following 8 functions
  - @is()
  - @and()
  - @or()
  - @not()
  - @gt()
  - @lt()
  - @ge()
  - @le()

examples

- @and(arg1, arg2)
  - can be used to check equality between numbers/vars
  - can be used to compare boolean values
  - can be used to start a function chain
    - the "@" at symbol is the result of the previous function in the chain
    - @and(arg1, arg2) : @or(@, argA) : ...
  - if @and() is called without any arguments, it is used as a syntactic passthrough
    - @is(#varX) : @and() : @not(#varY) : ...

- @or(arg1, arg2) 
  - return the true value
  - return false if neither arg is truthy
  - if @or() is called without any arguments, it is used as a syntatic passthrough
    - @if(#varQ) : @or() : @not(#varM) : ...

- @is(arg)
  - string boolean comparison only
    - returns true if arg is truthy, false if not
  - if @is() is called without any arugments, it is used as a syntactic passthrough
    - @if(#number) : @is() : @gt(@, 19) : ...

- @not(arg1, arg2)
  - when both args are present, @not() works as an inequality comparator
    - @not(4, 29) 
      - returns true because 4 is not (equal to) 29
  - when only one arg is passed, @not() works as a negation
    - similar to "(!bool_var)" in javasacript or "if [ -z "$1" ]" in bash
    - #false_var=false; @not(#false_var)
      - returns true 
  - @not() cannot be used as a passthrough function

### functions

- functions can have 0 - 3 arguments maxiumum
- functions can return 0 - 1 values maximum
- returns are implicit (value of the last command is return val)

- minimal functions
    - @helloworld=(arg, arg2) "#arg, #arg2"; @helloworld("hello", "planet")
  - a return value can be a variable declaration
    - the value of the #var is returned, the #var itself is set to false
    - @helloworld=(arg, arg2) val="#arg, #arg2"; @helloworld("hi", "world")
  - functions cannot have methods

### list

- one data structure: non associative list as curly braces
  - eg: #list={1, 2, 4, 5}
  - lists can contain any combination of values
  - empty lists are allowed (will evaluate to false)

  - lists feature initialization, insertion and extraction
    - no list iteration or looping
    - list commands are not chainable
  
  - lists can be nested to a depth of 3
    - #three_depth={"list one", {"list two", {"list three"}}}
  
  - insert into a list using @ins()
    - example...

  - extraction from list using @ext()
    - indicies are 0-based
    - @ext(#list, #index 
      - or @ext(#list, {#index1, #index2, #index3})
    - @ext(#three_depth, {0,0,0}) # => "list three"
    - @ext(#list) - no argument will return the full list as string

### math

- math functions: @add(), @sub(), @mul(), @div()
  - chainable: 

@add(2,3) : @mul(@,10)  : ...

### text / files

- minimal text processing functions: @rpl()
  - chainable: 

@rpl(#text, "replace this", "add these words") 
or @rpl(#text, "replace thisd too", "")

- minimal file operations: @read(path), @write(#content, path)
- chainable with text commands

### i/o

- minimal i/o: @in(), @out(), @err()
  - not chainable