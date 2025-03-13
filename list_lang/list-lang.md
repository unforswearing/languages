---
title: 
tags: 
date created: Friday, July 2nd 2021, 12:45:52 am
date modified: Wednesday, November 24th 2021, 4:25:48 pm
---

# List Lang

> a language that only uses lists and list methods, an extension of (some lang) Arrays

## Lists

- lists are arrays that can be used independently of a parent lang
- lists have a subset of Array methods and additional helper functions

### Operators

`+` : create a new list

+newList: List()

+newList.idx            - default index value available in all list functions
        .def            - value at index in the list available in all list functions

+newList
	.concat()
	.includes()
	.indexOf()
	.each()
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
	.out()          - print a list to console
	.in()           - read input from console into a new list













