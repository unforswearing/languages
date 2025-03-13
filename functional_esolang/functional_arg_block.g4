grammar functional_arg_block;

block: '{' explist? '}';

explist: reserved (',' reserved)*;

reserved:
	| 'print'
	| 'printf'
	| 'set'
	| 'rem'
	| 'if'
	| 'if_else'
	| 'loop'
	| 'while'
	| 'for'
	| 'function'
	| 'true'
	| 'false';

funcbody: '(' parlist? ')' block 'end';

parlist: namelist (',' '...')? | '...';

namelist: NAME (',' NAME)*;

NAME: [a-zA-Z_][a-zA-Z_0-9]*;

WS: [ \t\n\r]+ -> skip;