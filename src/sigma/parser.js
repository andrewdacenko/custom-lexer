import {Keyword, Constants} from './keyword';
import {TokenType} from './token';

export class ParserError extends Error {
    constructor(message, token) {
        super(message);

        this.token = token;
    }
}

export class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.index = -1;
    }

    getNextToken() {
        this.token = this.tokens[++this.index];

        if (!this.token) {
            throw new ParserError('Unexpected End of program', this.token);
        }
    }

    parse() {
        if (!this.tokens.length) {
            throw new ParserError('No Code found');
        }

        return this.parseProgram();
    }

    parseProgram() {
        this.getNextToken();

        if (this.token.value !== Keyword.PROGRAM) {
            throw new ParserError(`Program should start with ${Keyword.PROGRAM} keyword`);
        }

        this.getNextToken();
        if (!TokenType.isIdentifier(this.token.type)) {
            throw new ParserError(`Program should have name`, this.token);
        }

        this.getNextToken();
        if (this.token.value !== ';') {
            throw new ParserError('Wrong punctuation', this.token);
        }

        this.parseBlock();

        this.getNextToken();
        if (this.token.value !== '.') {
            throw new ParserError('Program should end with dot', this.token);
        }

        try {
            this.getNextToken();
        } catch (err) {
            return;
        }

        throw new ParserError('Unexpected input after program end', this.token);
    }

    parseBlock() {
        this.getNextToken();
        this.parseVariables();

        if (this.token.value !== Keyword.BEGIN) {
            throw new ParserError('Block should start with BEGIN keyword', this.token);
        }

        this.getNextToken();
        if (this.token.value !== Keyword.END) {
            throw new ParserError('Block should end with END keyword', this.token);
        }
    }

    parseVariables() {
        if (this.token.value === Keyword.VAR) {
            this.parseDeclarations();
            return this.parseVariables();
        }

        if (this.token.value === Keyword.BEGIN) {
            return;
        }

        throw new ParserError('Unexpected input', this.token);
    }

    parseDeclarations() {
        this.getNextToken();

        if (!TokenType.isIdentifier(this.token.type)) {
            return;
        }

        this.getNextToken();
        if (this.token.value === ',') {
            return this.parseDeclarations();
        }

        if (this.token.value !== ':') {
            throw new ParserError('Variables should have types', this.token);
        }

        this.parseAttributeBlock();

        if (this.token.value !== ';') {
            throw new ParserError('Punctuation error, `;` expected', this.token);
        }

        this.getNextToken();
    }

    parseAttributeBlock() {
        this.getNextToken();
        this.parseAttribute();
        this.parseAttributesList();

        if (this.token.value === ';') {
            return;
        }
    }

    parseAttributesList() {
        this.getNextToken();
        if (this.token.value === ';') {
            return;
        }

        this.parseAttribute();
        this.parseAttributesList();
    }

    parseAttribute() {
        const isConstant = Constants.includes(this.token.value);

        if (!isConstant) {
            if (this.token.value === '[') {
                this.parseRangeBlock();
            } else {
                throw new ParserError('No Attribute type defined', this.token);
            }
        }
    }

    parseRangeBlock() {
        this.getNextToken();
        this.parseRange();
        this.parseRangeList();

        if (this.token.value === ']') {
            return;
        }
    }

    parseRangeList() {
        this.getNextToken();
        if (this.token.value === ']') {
            return;
        }

        if (this.token.value !== ',') {
            throw new ParserError('Comma missing in range list', this.token);
        }

        this.getNextToken();
        this.parseRange();
        this.parseRangeList();
    }

    parseRange() {
        if (!TokenType.isNumber(this.token.type)) {
            throw new ParserError('Range should have numeric as first argument', this.token);
        }

        this.getNextToken();
        if (this.token.value !== '..') {
            throw new ParserError('Range should have `..` between numbers', this.token);
        }

        this.getNextToken();
        if (!TokenType.isNumber(this.token.type)) {
            throw new ParserError('Range should have numeric as second argument', this.token);
        }
    }
}