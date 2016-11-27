import {
    KEYWORDS
} from './table';

const KEYWORDS_TOKENS = Object.keys(KEYWORDS).reduce((table, key) => {
    return {...table, [KEYWORDS[key]]: key};
}, {});

export const ACTION = {
    SCAN: 'SCAN',
    PROGRAM: 'PROGRAM'
};

export function parse(tokens, tables) {
    try {
        const result = analyze(tokens, 0, ACTION.PROGRAM);
    } catch (error) {
        return error.message;
    }
}

function analyze(tokens, index, action) {
    switch (action) {
        case ACTION.PROGRAM:
            analyzeProgram(tokens, index);
            return;
    }

    return [];
}

function analyzeProgram(tokens, index) {
    const lexem = tokens[index];

    if (lexem.code !== KEYWORDS.PROGRAM) {
        throw new Error(`
            Error at ${lexem.line}:${lexem.lineIndex - lexem.token.length}
            - Signal Program should 
            start with ${KEYWORDS_TOKENS[KEYWORDS.PROGRAM]}
        `);
    } else {
        checkIdentifier(tokens[index + 1]);
    }
}

function checkIdentifier(lexem) {
    if (lexem.token && lexem.token) {

    }
}