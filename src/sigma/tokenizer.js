import {ErrorHandler} from './error-handler';
import {Scanner} from './scanner';
import {TokenName, Token} from './token';

export class Tokenizer {
    constructor(code) {
        this.errorHandler = new ErrorHandler();

        this.scanner = new Scanner(code, this.errorHandler);

        this.buffer = [];
    }

    errors() {
        return this.errorHandler.errors;
    }

    getNextToken() {
        if (this.buffer.length === 0) {
            const comments = this.scanner.scanComments();

            for (let i = 0; i < comments.length; ++i) {
                const e = comments[i];
                let comment;
                let value = this.scanner.source.slice(e.slice[0], e.slice[1]);
                comment = {
                    type: TokenName[Token.Comment],
                    value: value,
                    range: e.range,
                    loc: e.loc
                };
                // this.buffer.push(comment);
            }

            if (!this.scanner.eof()) {
                let loc = {
                    start: {
                        line: this.scanner.lineNumber,
                        column: this.scanner.index - this.scanner.lineStart
                    },
                    end: {}
                };

                const token = this.scanner.lex();

                loc.end = {
                    line: this.scanner.lineNumber,
                    column: this.scanner.index - this.scanner.lineStart
                };

                const entry = {
                    type: TokenName[token.type],
                    value: this.scanner.source.slice(token.start, token.end),
                    range: [token.start, token.end],
                    loc: loc
                };

                this.buffer.push(entry);
            }
        }

        return this.buffer.shift();
    }
}
