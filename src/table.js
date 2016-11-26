export const KEYWORDS = {
    PROGRAM: 401,
    VAR: 402,
    BEGIN: 403,
    END: 404,
};

export const IDENTIFICATORS = {
    SIGNAL: 1001,
    COMPLEX: 1002,
    INTEGER: 1003,
    FLOAT: 1004,
    BLOCKFLOAT: 1005,
    EXT: 1006,
};

export const CONSTANTS = {

};

export const DELIMITERS = {
    ';': ';'.charCodeAt(0),
    ',': ','.charCodeAt(0),
    ':': ':'.charCodeAt(0),
    '.': '.'.charCodeAt(0),
    '[': '['.charCodeAt(0),
    ']': ']'.charCodeAt(0)
};

export const MULTI_DELIMITERS = {
    '..': 301,
};

export const WHITESPACES = {
    [String.fromCharCode(9)]: 9,
    [String.fromCharCode(10)]: 10,
    [String.fromCharCode(11)]: 11,
    [String.fromCharCode(12)]: 12,
    [String.fromCharCode(13)]: 13,
    [String.fromCharCode(32)]: 32,
};
