import {
    WHITESPACES,
    KEYWORDS,
    IDENTIFICATORS,
    DELIMITERS,
    CONSTANTS,
    MULTI_DELIMITERS
} from './table';

export class Lexer {
    constructor(text) {
        this.currentIndex = -1;
        this.length = text.length;
        this.text = text;
        this.lastIdentificator = 1006;
        this.lastConstantIdentifier = 500;
    }

    parse() {
        const codes = [];
        let text = '';

        while (true) {
            const char = this._next();

            if (char === null) {
                break;
            }

            if (WHITESPACES[char] && !text) {
                continue;
            }

            if (DELIMITERS[char] || WHITESPACES[char]) {
                const isMultiDelimiter = this._isMultiDivider();

                if (isMultiDelimiter) {
                    codes.push({text: isMultiDelimiter, code: MULTI_DELIMITERS[isMultiDelimiter]});
                    text = '';
                    this.currentIndex++;
                    continue;
                }

                if (!text) {
                    putDelimiter(char);
                    continue;
                }

                if (Number.isNaN(0 - text)) {
                    IDENTIFICATORS[text] = ++this.lastIdentificator;
                } else {
                    CONSTANTS[text] = ++this.lastConstantIdentifier;
                }
            } else {
                text += char;
            }

            if (KEYWORDS[text]) {
                codes.push({text, code: KEYWORDS[text]});
                text = '';
                putDelimiter(char);
                continue;
            }

            if (IDENTIFICATORS[text]) {
                codes.push({text, code: IDENTIFICATORS[text]});
                text = '';
                putDelimiter(char);
                continue;
            }

            if (CONSTANTS[text]) {
                codes.push({text, code: CONSTANTS[text]});
                text = '';
                putDelimiter(char);
                continue;
            }

            if (DELIMITERS[char]) {
                text = '';
                putDelimiter(char);
            }

            function putDelimiter(char) {
                if (DELIMITERS[char]) {
                    codes.push({char, code: DELIMITERS[char]});
                }
            }
        }

        return {
            program: codes,
            tables: {
                WHITESPACES,
                KEYWORDS,
                IDENTIFICATORS,
                DELIMITERS,
                CONSTANTS,
                MULTI_DELIMITERS
            }
        };
    }

    _next() {
        if (this.currentIndex !== this.length - 1) {
            this.currentIndex += 1;

            return this.text[this.currentIndex];
        }

        return null;
    }

    _isMultiDivider() {
        if (this.currentIndex < this.length - 2) {
            const text = this.text[this.currentIndex] + this.text[this.currentIndex + 1];
            return MULTI_DELIMITERS[text] ? text : false;
        }

        return false;
    }
}
