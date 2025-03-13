# Unnamed lang
> tentative name: mmpos (mickey mouse piece of shit)

I have been reading about language design and figured why not try it, inspired by Lua, shell scripting, and many old languages. My background includes English language / linguistic studies and building a constructed human language was on my list for a while, and building a programming language fits the need pretty well. 

## overview

- lists, and vars all use the same data structure: ()

```

  - operators:    %, #, ::, @
  
  - variables:    #number_two(2)

  - conditional:  @when(true === true) :> @out("of course it is")

  - @text:        @text("you have " #miles " to go")
    - replace:    @text.rpl("replace this", "add text")
    - delete:     @text.rpl("don't need this")
  
  - @math:        @math(4 * 3 / 22)

  - @list:        #items(
                    @list(4.5, "this", "that", true)
                  )
  
    - ins:        @list.ins(#value, #index)
    - ext:        @list.ext(#value, #index)
    - each:       @list.each(#i, #item(#list(#i))) :: 
                    #txt("list item: " #i " = " #item)
                    @out(#txt)
    - from:       @list.from(#text)

```

## stdlib functions
  - @when()
  - @math()
  - @list()
    - @list.ins()
    - @list.ext()
    - @list.each()
    - @list.from()
  - @text()
    - @text.rpl() 
  - @out()
  - @shell()
  
## operators

```

%  comments begin with the percent character and run to EOL
:: used to join the "actions" to declaration of conditionals, and iteration
#  declare variable `#varname(in("/path/file.txt"))` 
@   use a built in function 

```

## types
  - list 
  - text

## variables
  - new variables are assigned by declaring the varible name like calling a function
    `#number_list(3, 5, 7, 1, 9, 3, 6)`
  - if a var (eg. #number_list) already exists it will be overwritten
  - string concat can be done by 
    `#jobtitle("insurance agent")`
    `#text("hi there, i am your " #jobtitle)`

## conditional
  - when()
    - works like if, then, else
    - performs both integer and number comparisons
    - all comparisons return true or false
    - comparisons use bash a subset of bash comparison args

    - usage   
      ```

      #item(true)

      @when(#item === true) :: 
        then block :: 
        else block

## text
  - @text()
    - pass text to other command or arg
    ```
    #distance(@text("you have " #miles " to go")))`
    ```

  - @text.rpl() replaces text
    ```
    @text.rpl("replace this", "add string")
    ```
  - @text.rpl() with replacement string will delete the substring from 'text'

## math
  - @math()
    - all math operations need to use the math function
    - the number type only exists in the math function
    - math(2 + 2)
    - math(2 % 16)
    - etc

## lists
  - @list()
    - similar to js arrays

```
    % usage: #list(4.5, "this", "that", true)
      % output (4.5, "this", "that", true)

    % the only way to insert or extract items from a list is to use 
      #list.ins(#idx) 
      % and
      #list.ext(#idx)

    % list methods
      #list.ins(#value)
      #list.ins(#value, #idx)
  
      #list.ext(#value)
      #list.ext(#value, #idx)
  
      #list.each()
        % the only option for iterating over a list
        % list.each() with no args will return the list length
        % each arguments are passed as a list 
          % the first arg must be the index variable, 
          % second arg must be a definition of item at index
        % "do" is separate list containing commands
        
      #list.each
        #i, #item(list(#i))) ::
          @out("list item: #i " = " #item)

      #list.from() 
        % create a list from a variable
          % strings and numbers are split character wise
          % 1 character strings or numbers will be added as a single item in a new list
          % #list.from(#listvar) will return the listvar unmodified
          % everything else is added as a single item
```

## iteration

- only happens with list.each()

## out

- output text to console  

`@out("this message will be printed to the console")`

- output text to file


