import {Message} from './message';
import {Token} from './token';
import {Character} from './character';
import {Keyword} from './keyword';
import {Punctuator, MultiPunctuator, PunctuatorCodes} from './punctuator';

export class Scanner {
    constructor(code, handler) {
        this.source = code;
        this.errorHandler = handler;
        this.trackComment = false;

        this.length = code.length;
        this.index = 0;
        this.lineNumber = (code.length > 0) ? 1 : 0;
        this.lineStart = 0;
    }

    eof() {
        return this.index >= this.length;
    }

    throwUnexpectedToken(message = Message.UnexpectedToken) {
        this.errorHandler.throwError(
            this.index,
            this.lineNumber,
            this.index - this.lineStart + 1,
            message
        );
    };


    tolerateUnexpectedToken() {
        this.errorHandler.tolerateError(
            this.index,
            this.lineNumber,
            this.index - this.lineStart + 1,
            Message.UnexpectedToken
        );
    };

    static isKeyword(id) {
        return Object.keys(Keyword).indexOf(id) !== -1;
    }

    getIdentifier() {
        const start = this.index++;

        while (!this.eof()) {
            const ch = this.source.charCodeAt(this.index);

            if (Character.isIdentifierPart(ch)) {
                ++this.index;
            } else {
                break;
            }
        }

        return this.source.slice(start, this.index);
    }

    skipMultiLineComment() {
        let comments = [];
        let start, loc;

        start = this.index - 2;
        loc = {
            start: {
                line: this.lineNumber,
                column: this.index - this.lineStart - 2
            },
            end: {}
        };

        while (!this.eof()) {
            const ch = this.source.charCodeAt(this.index);
            if (Character.isLineTerminator(ch)) {
                if (ch === 13 && this.source.charCodeAt(this.index + 1) === 10) {
                    ++this.index;
                }
                ++this.lineNumber;
                ++this.index;
                this.lineStart = this.index;
            } else if (ch === 42) {
                // Block comment ends with '*)'
                if (this.source.charCodeAt(this.index + 1) === 41) {
                    this.index += 2;

                    loc.end = {
                        line: this.lineNumber,
                        column: this.index - this.lineStart
                    };
                    const entry = {
                        slice: [start + 2, this.index - 2],
                        range: [start, this.index],
                        loc: loc
                    };
                    comments.push(entry);

                    return comments;
                }
                ++this.index;
            } else {
                ++this.index;
            }
        }

        // Ran off the end of the file - the whole thing is a comment
        loc.end = {
            line: this.lineNumber,
            column: this.index - this.lineStart
        };

        const entry = {
            slice: [start + 2, this.index],
            range: [start, this.index],
            loc: loc
        };

        comments.push(entry);

        this.tolerateUnexpectedToken();

        return comments;
    }

    scanComments() {
        let comments = [];

        let start = (this.index === 0);
        while (!this.eof()) {
            let ch = this.source.charCodeAt(this.index);

            if (Character.isWhiteSpace(ch)) {
                ++this.index;
            } else if (Character.isLineTerminator(ch)) {
                ++this.index;
                if (ch === 13 && this.source.charCodeAt(this.index) === 10) {
                    ++this.index;
                }
                ++this.lineNumber;
                this.lineStart = this.index;
                start = true;
            } else if (ch === 40) { // is '('
                ch = this.source.charCodeAt(this.index + 1);
                if (ch === 42) {  // is '*'
                    this.index += 2;
                    const comment = this.skipMultiLineComment();
                    comments = comments.concat(comment);
                } else {
                    break;
                }
            } else {
                break;
            }
        }

        return comments;
    }

    scanIdentifier() {
        let type;
        const start = this.index;

        const id = this.getIdentifier();

        if (Scanner.isKeyword(id)) {
            type = Token.Keyword;
        } else {
            type = Token.Identifier;
        }

        return {
            type: type,
            value: id,
            lineNumber: this.lineNumber,
            lineStart: this.lineStart,
            start: start,
            end: this.index
        };
    }

    scanPhone() {
        const token = {
            value: '+',
            lineNumber: this.lineNumber,
            lineStart: this.lineStart,
            start: this.index,
            end: this.index
        };
        this.index++;

        const three = this.scanNumber();
        if (three.value !== '38') {
            this.throwUnexpectedToken();
        }

        if (this.source[this.index] !== Punctuator.OpeningBracket) {
            this.throwUnexpectedToken();
        }

        this.index++;
        const region = this.scanIdentifier();
        if (region.value.length !== 3) {
            this.throwUnexpectedToken();
        }

        if (this.source[this.index] !== Punctuator.ClosingBracket){
            this.throwUnexpectedToken();
        }

        this.index++;
        if (!Character.isDigit(this.source.charCodeAt(this.index))) {
            this.throwUnexpectedToken();
        }
        const startNumber = this.scanNumber();
        if (startNumber.value.length !== 3) {
            this.throwUnexpectedToken();
        }

        if (this.source[this.index] !== Punctuator.Dash){
            this.throwUnexpectedToken();
        }

        this.index++;
        if (!Character.isDigit(this.source.charCodeAt(this.index))) {
            this.throwUnexpectedToken();
        }
        const midNumber = this.scanNumber();
        if (midNumber.value.length !== 2) {
            this.throwUnexpectedToken();
        }

        if (this.source[this.index] !== Punctuator.Dash){
            this.throwUnexpectedToken();
        }

        this.index++;
        if (!Character.isDigit(this.source.charCodeAt(this.index))) {
            this.throwUnexpectedToken();
        }
        const lastNumber = this.scanNumber();
        if (lastNumber.value.length !== 2) {
            this.throwUnexpectedToken();
        }

        return {
            ...token,
            type: Token.Number,
            value: `+38[${region.value}]${startNumber.value}-${midNumber.value}-${lastNumber.value}`,
            end: this.index
        }
    }

    scanPunctuator() {
        const token = {
            value: '',
            lineNumber: this.lineNumber,
            lineStart: this.lineStart,
            start: this.index,
            end: this.index
        };

        let type = Token.Punctuator;

        let str = this.source[this.index];
        switch (str) {
            case Punctuator.Plus:
                return this.scanPhone();
                break;
            case Punctuator.Dot:
                ++this.index;
                if (this.source[this.index] === Punctuator.Dot) {
                    this.index += 1;
                    type = Token.MultiPunctuator;
                    str = MultiPunctuator.DoubleDot;
                }
                break;
            case Punctuator.Semicolon:
            case Punctuator.Comma:
            case Punctuator.OpeningBracket:
            case Punctuator.ClosingBracket:
            case Punctuator.Colon:
                ++this.index;
                break;
        }

        if (this.index === token.start) {
            this.throwUnexpectedToken();
        }

        token.type = type;
        token.end = this.index;
        token.value = str;
        return token;
    }

    scanNumber() {
        const start = this.index;
        let number = this.source[this.index++];

        while (Character.isDigit(this.source.charCodeAt(this.index))) {
            number += this.source[this.index++];
        }

        if (Character.isIdentifierStart(this.source.charCodeAt(this.index))) {
            this.throwUnexpectedToken();
        }

        return {
            type: Token.Number,
            value: number,
            lineNumber: this.lineNumber,
            lineStart: this.lineStart,
            start: start,
            end: this.index
        };
    }

    lex() {
        if (this.eof()) {
            return {
                type: Token.EOF,
                lineNumber: this.lineNumber,
                lineStart: this.lineStart,
                start: this.index,
                end: this.index
            };
        }

        const cp = this.source.charCodeAt(this.index);

        if (Character.isIdentifierStart(cp)) {
            return this.scanIdentifier();
        }

        if (PunctuatorCodes.indexOf(cp) !== -1) {
            return this.scanPunctuator();
        }

        if (Character.isDigit(cp)) {
            return this.scanNumber();
        }

        return this.scanPunctuator();
    }
}
