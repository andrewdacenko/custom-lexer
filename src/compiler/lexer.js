import {
    WHITESPACES,
    KEYWORDS,
    IDENTIFIERS as PREDEFINED_IDENTIFIERS,
    DELIMITERS,
    CONSTANTS as PREDEFINED_CONSTANTS,
    MULTI_DELIMITERS
} from './table';

export function analyze(text) {
    const IDENTIFIERS = Object.assign({}, PREDEFINED_IDENTIFIERS);
    const CONSTANTS = PREDEFINED_CONSTANTS;
    let index = -1;
    let line = 0;
    let lineIndex = -1;

    const lexems = [];
    let lastIdentifier = 1006;
    let lastConstantIdentifier = 500;
    let token = '';

    while (true) {
        const char = next();

        if (char === null) {
            break;
        }

        if (WHITESPACES[char] && !token) {
            continue;
        }

        if (!DELIMITERS[char] && !WHITESPACES[char]) {
            token += char;
            continue;
        }

        if (DELIMITERS[char] || WHITESPACES[char]) {
            const divider = isMultiDivider(index, text);

            if (divider) {
                lexems.push({
                    token: divider,
                    lineIndex: lineIndex + 2,
                    line,
                    code: MULTI_DELIMITERS[divider]
                });
                token = '';
                index++;
                continue;
            }

            if (!token) {
                putDelimiter(char);
                continue;
            }

            if (Number.isNaN(0 - token)) {
                if (!KEYWORDS[token] && !IDENTIFIERS[token]) {
                    IDENTIFIERS[token] = ++lastIdentifier;
                }
            } else {
                CONSTANTS[token] = ++lastConstantIdentifier;
            }
        }

        if (KEYWORDS[token]) {
            lexems.push({
                token,
                lineIndex,
                line,
                code: KEYWORDS[token]
            });
            token = '';
            putDelimiter(char);
            continue;
        }

        if (IDENTIFIERS[token]) {
            lexems.push({
                token,
                lineIndex,
                line,
                code: IDENTIFIERS[token]
            });
            token = '';
            putDelimiter(char);
            continue;
        }

        if (CONSTANTS[token]) {
            lexems.push({
                token,
                lineIndex,
                line,
                code: CONSTANTS[token]
            });
            token = '';
            putDelimiter(char);
            continue;
        }

        if (DELIMITERS[char]) {
            token = '';
            putDelimiter(char);
        }
    }

    return {
        program: lexems,
        tables: {
            IDENTIFIERS,
            CONSTANTS
        }
    };

    function next() {
        if (index !== text.length - 1) {
            index += 1;
            lineIndex += 1;

            return text[index];
        }

        return null;
    }

    function putDelimiter(char) {
        if (DELIMITERS[char]) {
            lexems.push({
                token: char,
                lineIndex,
                line,
                code: DELIMITERS[char]
            });
        }

        if (WHITESPACES[char]) {
            switch(WHITESPACES[char]) {
                case 9:
                case 10:
                case 13:
                    line++;
                    lineIndex = -1;
                    break;
            }
        }
    }
}

function isMultiDivider(index, text) {
    if (index < text.length - 2) {
        const token = text[index] + text[index + 1];
        return MULTI_DELIMITERS[token] ? token : false;
    }

    return false;
}
