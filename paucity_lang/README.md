
# Paucity-lang Specification
> paucity: smallness of number or quantity
> paucity: a very minimal, restricted, statically typed language

- this programming language is called Paucity
- Puacity is written in Typescript
- files are saved as program.pauc
- this spec file originated on 6/19/2021

@remind [6/21/2021] DO NOT ADD OR REMOVE ANYTHING ELSE! START WRITING!

## Preamble

> Goal for Paucity: write an extremely minimal language (hence "paucity")
> that can perform common light tasks, replacing shell scripts. 
> 
> Paucity is scripting DSL, not a general purpose language. There are many
> "features" missing when compared to a standard general purpose language.
> 
> Paucity places emphasis on clarity, readability, and data safety.
> Paucity is Strong and Dynamically typed (why Typescript was chosen)
> 
> Syntax is inspired by Lua, Bash, Typescript, Applescript, and many of 
> the imperative and procedural languages of the 1960's/70's
>
> - no type coersion, but also no need to specify types in code
> - types are checked and strictly enforced at runtime
>
> The minimalism of Paucity means it is also very unforgiving and somewhat restricted, eg.
> 
>     - no multiline expressions, minimal math operations, no control structures
>     - mandatory single line functions, very few operators, no deletions from file system, etc.
> 
> These constraints may lead to a somewhat safe language in the sense that there should be no
> surprise behaivor, and there is usually only one way to do something. This will probably
> make the language way more verbose, but also more easily understood.
> 
> ...
> 
> see also
> https://docs.google.com/spreadsheets/d/1Ax2Udygza3xAkdBrJOzl7U007m5ch-rDxlObEUGAwT4/edit#gid=0
> 
> ...

<br>

## Planning

<br>

### reminders

@remind **KEEP THIS SIMPLE!** this should be a small language. tiny. dont add too much more

<br>

### specification

- no todo items.

<br>

### eventually

@todo build a cli:
  - two opts
    -    `-r | --repl | repl`
    -    `-e <file> | --execute <file> | execute <file>`

## Notes and Restrictions

- multi line data is invalid. all functions, `rpt`, and data structures must be on one line.
- nothing can be nested: no lists inside lists, function calls must be saved as var before using
- no initializing empty lists or functions, no empty rpt blocks or missing rfn functions
- all functions (including user functions) take 0 - 3 arguments total. other args are discarded
- all functions return 0 - 1 value. this value can be a list. 
- data safety - files can only be created and modified, not deleted. file ops are auto-backed up
- all programs terminate on error, no exceptions
- no operators for direct math, only simple mathematical and comparator functions
- no built-in networking or http (can be done using `%shell`)
- no standard i/o (can be done using `%shell`)

## Syntax

### hello world

```
show "hello world!"

```

### whitespace

- multiline statements are illegal, everything is executed on a single line
- the space character is the only recognized whitespace. all other
  whitespace is treated as a single space

```
" "

```

### text

- valid text

```
abcdefghijklmnopqrstuvwxyz
ABCDEFJHIJKLMNOPQRSTUV

```

### operators

```
double dot     (..)  - comment               ->   ..this is a comment to end of line
semicolon      (;)   - separate commands     ->   items:2; total:@add(items,other_items)
colon          (:)   - variable assignment   ->   varname:"hello, this is a var"
hash           (#)   - variable reference    ->   #variable
underscore     (_)   - denote local rpt var  ->   fn rpt_func() _item:list(#idx); show #_item dn 
at             (@)   - call functions        ->   @fname
percent        (%)   - run shell command     ->   %echo "command executed on $(date)"

```

- all other operators are invalid and cannot be used as variables!

### keywords

```
err
show
exit
fn
ret
if
else
dn
rpt
rfn

```

### types

- list | number | text | none | boolean
  - Paucity is strongly typed - all types are enforced at runtime
  - Paucity is dynmaically typed - types are inferred through use 
  - errors are thrown when an operation uses the incorrect type. 
- types can be checked using the `@istype()` function
  - see the "functions" section below for examples

### reserved words

```
true
false
none
text
list
number
boolean

```
### boolean

```
two_is_not_three:true

..a more practical example: use @not() similarly as !varname in javascript
..is two equal to five?

two_is_five:@eq(2,5)

..the code below is equivalent to `if (!two_is_five)` in javascript
two_is_not_five:@not(#two_is_five)

if (#two_is_not_five) show "correct, two is not equal to five" dn

```

### none

- `none` is equivalent to null or nil. none has no methods and is always true. 

### comments

- comments begin with two dots and run to end of line
- comments can appear above or after executable code. 
- no multiline comments

```
..this is a comment
show "a valid comment" ..comments after code are ok

..this is not valid -- show "this text will never print"

```


### variables

#### limitations

- assignment uses a colon ":"
- all variables are constants, no reassignment (except vars local to rfn / rpt)
- variables are case insensitive!
- no empty variables! all variables must have a value when initialized
- functions cannot be assigned to variables for execution (only one way to do a particular task)
  - there is no `var:fn(arg) body ret #value dn`

#### examples

```
..set variable named "name" to the value "tom"
..variables are set in a global script object and cannot be changed, only unset

name : "tom"

..
..whitespace doesn't matter

middle_name:"walter"
last_name : "jacobs"

..
..set "first_name" to value of "name"
..the variable "name" must include the hash `#`
..the hash indicates the interpreter must look in the global object
..to see if the variable exists yet. if not, first_name will be "none"
..but since it was set above, first_name here will be "tom"

first_name:#name

..
..variables can be accessed by using a hash mark '#' before the variable name
..the hash indicates that the interpreter should look in the global object, etc..
..text concatenation works exactly like bash

name_message:"name is #name"
show #name_message

..
..the interpreter will search for "name" in the global object before setting it
..since it already is set to "tom", the lookup fails and produces an error

name:"mike"   ..error "var name cannot be reassigned"

..
..variables in rfn / rpt functions must be "local"
..the rfn keyword allows the inclusion of the #def and #idx rpt vars, 
..  which would otherwise be out of scope for this function

..
..in the example below, "_local_var" and "_total" are local to the rpt loop

rfn test() _local_var:#idx; _total:@add(#_local_var, 3) dn

```

### functions

#### limitations

- there is only one way to create a function: `fn func_name(args) func_body ret #value dn`
  - args and ret are not required.
  - func_name and func_body are required (no anonymous functions, no empty functions)
- all functions, even type methods, are called with a prefixed "at" symbol
- all functions must be written on one line. there is no syntax for multiline functions.
- functions cannot be nested! (no nesting) -- eg. `@full_name(@first(), @last())` will not work
- functions accept 0 - 3 arguments. all others are discarded
- functions arguments must be one of: number, text, file, list, boolean
- functions return 0 - 1 value.
- functions must end with `dn` for "done". eg. `fn test(testarg) show #testarg dn`
  - eg. `@functioncall()` or `type@method()`
- functions cannot be executed as expressions (only one way to create functions)
  - there is no construction like `var:fn(arg) body ret #value dn`
- functions cannot have methods

#### examples

```
..create a function named 'name'
fn name(first, last) ret "#first #last" dn

..functions are called using `@`
@name("tom", "smith")

..set variable "full_name" to "tom smith"
full_name:@name("tom", "smith")

```

#### general functions

```
@eq(#var_one, #var_two)     ..equality   (works with text, numbers, and bools)
@ne(#var_one, #var_two)     ..inequality (works with text, numbers, and bools)

..check if #variable is a specific type
@istype(#var, list|number|text|none|boolean)

..check if #variable has any value
@hasval(#var)

```

**rpt**

- `rpt` is the only way to loop / iterate over a list or text.
  - text is automatically split character-wise
- repeat loops are not infinite and must terminate 
- all `rpt` loops must have an associated executor function initialized using `rfn`. 
  - see examples below

***examples***

```
..iterate over a list or text
..  #number_of_repeats is optional

@rpt(#list_or_text, exec_func, #number_of_repeats)

..
..special variables in @rpt:
..#idx and #def are available to the executor function "check_list"
..#idx is the index of the current loop
..#def is a "default" variable that contains the item at index `#idx`
..     this is equivalent to `def:items(#idx)

..
..all `rpt` loops must have an associated executor function.
..this function is initialized using the `rfn` keyword

rfn check_list(list_item) _is_available:@hasval(#def); if (#_is_available) show #def dn
@rpt(#list_var, check_list)

..
..rpt with no numeric argumet (arg 3) will loop through the list once
@rpt(#list_var, check_list)

..
..loop over a list more than once by assigning a numeric arg
@rpt(#text_var, check_list, 3)

..
..more practically, this can be used to loop over one list 
..for each item in another list

items_a:{1,2,3,"hello"}
items_b:{"x","y","z","q"}

..
..get the length of the list 
loop_len:items_b@len()

..
..variables set in a rpt loop must be "local" to the loop
..as indicated by the underscore "_" prefixed to the "item" variable
..underscore prefixed variables are unset immediately after the loop ends
..#idx and #def are available to the exec function

rfn exec() _item:items_b(#idx); show "#def) #_item" dn
@rpt(items_a, exec, #loop_len) 

..the code above produces:
..> 1) x
..> 2) y
..> 3) z 
..> hello) q

```

#### file functions

- all file functions take 0 - 1 arguments. all others are discarded
- Paucity automatically backs up all files before operating on them

***examples***

```
..read file.txt into var "document"
..note the assignment operator prefixed to var "document"

@read(file_var, "/path/to/file.txt")

..  @write and @scrub only work on an open / read file.  ..

..file writes append by default.
..write text into var "document"
@write(:document, "this is more text to append to file.txt")

..to completely replace the text in a file, use 'scrub'
..@scrub(:document) with no text arg will create an empty file
@scrub(:document, "the other text wasn't good. this is better")

..close the file to prevent further editing.
@close()

```

#### list functions

***examples***

```
..add to list
@ins(#list, "testing", #index_number)

..get list length
@len(#list)

..rm from list
@del(#list, 4)

```

#### text functions

- using a text var with `rpt` will automatically split the text into a list

```
..replace string in text 
@replace(#text_var, #text_to_remove, #text_to_add)

..completely remove string from text, without replacement
@delete(#text_var, #text_to_remove)

```

#### math functions

***examples***

```
..addition
@add(2,2)

..subtraction
@sub(2,2)

..multiplication
@mul(2,2)

..division
@div(2,2)

..equality
@eq(2,2)

..inequality
@ne(2,2)

..args from the bash comparisons
@lt()
@gt()
@le()
@ge()

..other comparisons
@and()
@or()
@not()

```

### if / else

#### limitations

- if / else cannot be nested!
- if statements only accept boolean and `@eq` / `@ne` / and other true/false/none values
- no nesting!
  - all function calls, comparisons, variable declarations must happen before the if statement
- if / else blocks should end with `dn` for "done"
- there is no "else if", "elif", etc
- use `@and()`, `@or()`, `@not()` prior to the if statement when performing comparisons. 
  - see below for examples

#### examples

```
..without an else block (do not need the "then" keyword)
..no nesting, the value of the @eq() call must be stored as a var before using with "if"

var:true
varistrue:@eq(#var, true)
if (#varistrue) show "var is indeed true" dn

..
..including the else block (needs the then keyword)

var:false
varisfalse:@eq(#var, false)
if (#varisfalse) show "yes #var is false" else show "no, #var is true" dn

..
..using "and"
two_equals_two:@eq(2,2)
both_are_true:@and(#varisfalse, #two_equals_two)
if (#both_are_true) show "both are true! var is false and 2 = 2!" dn

..
..using "or"
one_is_true:@or(#two_equals_five, #two_equals_two)
if (#one_is_true) show "one of these items is true!" dn

..
..using "not", as in "!#var"
..two_equals_five == false
two_does_not_equal_five:@not(#two_equals_five)
if (#two_does_not_equal_five) show "correct, two is not equal to five" dn

```

### lists

#### limitations

- lists `{}` are the only data structure, similar to lua
- list literals `{}` cannot be nested, but lists can be comprised entirely of variables
  that reference lists. eg, `list_of_lists::list{#list_one, #list_two}`
- empty lists are invalid and will throw an error. all lists must contain at least one value
- lists are not arrays and may not be associative!
  - eg. this is invalid: `listvar:{item1 = "test"}`

#### examples

```
..declare a list (all vars are constants)
immutable_items:{"hello", false, 8, "/path/to/junk.txt"}

..
.. list items can only be accessed by their index:
..from "immutable_items" list (cannot be modified)

immutable_items(0)    ..equals "hello"
immutable_items(1)    ..equals false
immutable_items(2)    ..equals 8
immutable_items(3)    ..equals "/path/to/junk.txt"

```

### text

#### limitations

- all text is immutable! no reassigning variables!

#### examples

```
my_text:text("this is my text")

fn return_some_text() ret "this is some text" dn 
other_text:@return_some_text()

```

### general

#### show

- `show` is similar to 'print' or 'echo' commands. no options, only print argument value
  - string concatenation for variables works like in bash

```
show #var
show "this is some text, and here is #var"

```

#### err

- `err` produce a single line of error text and exit
  - `err` without error text `err()` will display a generic warning
  - `err` will halt execution in all circumstances.
    - Paucity does not contain a "warn" keyword or fall through errors

```
var:1
var_is_false:@eq(#var, 2)
if (var_is_false) err("#var is not equal to 2!") dn

```

#### exit

- `exit` ends program immediately
  - `exit` is not a function  

```
var:1
is_false:@eq(#var, 2)
if (is_false) exit dn

```

#### shell

- use `%` to run arbitrary shell commands in any user shell
  - vars can be used and set in shell commands
  - NOTE: Paucity functions cannot be run inside shell commands (no nesting)
  - NOTE: `rm` / `trash` / etc commands that remove items from the file system will
          throw an error at runtime (no removing files from the filesystem)

```
..an arbitrary command (assuming shell is bash-like)
%echo "hello, this was command executed on $(date) by Paucity" dn

..
..use a var in a shell command
customer_name:"bob"
%echo "hello #customer_name" dn

..
..save the result of shell command to var (assignment uses ":" as expected)
..note the use of has "#" prefixed to the variable being assigned - 
..Paucity variables assigned in a shell command must be prefixed with #

%#date:date dn
show #date

```
