1. <signal-program> -> <program>
1. <program> -> PROGRAM <procedure-identifier> ; <block>.
1. <block> -> <declarations> BEGIN <statements-list> END
1. <statements-list> -> <empty>
1. <declarations> -> <variable-declarations>
1. <variable-declarations> -> VAR <declarations-list> | <empty>
1. <declarations-list> -> <declaration> <declarations-list> | <emty>
1. <declaration> -> <variable-identifier><identifiers-list>: <attribute><attributes-list> ;
1. <identifiers-list> -> , <variable-identifier><identifiers-list> | <empty>
1. <attributes-list> -> <attribute> <attributes-list> | <empty>
1. <attribute> -> SIGNAL
    | COMPLEX
    | INTEGER
    | FLOAT
    | BLOCKFLOAT
    | EXT
    | [<range><ranges-list>]
1. <ranges-list> -> ,<range> <ranges-list> | <empty>
1. <range> -> <unsigned-integer> .. <unsigned-integer>
1. <variable-identifier> -> <identifier>
1. <procedure-identifier> -> <identifier>
1. <identifier> -> <letter><strign>
1. <string> -> <letter><string>
    | <digit><string>
    | <empty>
1. <unsigned-integer> -> <digit><digits-string>
1. <digits-string> -> <digit><digits-string> | <empty>
1. <digit> -> 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
1. <letter> -> A | B | C | ... | Z


+38[abc]111-11-11