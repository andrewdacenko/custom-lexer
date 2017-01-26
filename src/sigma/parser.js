import {Keyword, Constants} from './keyword';
import {TokenType} from './token';

export class ParserError extends Error {
    constructor(message, token) {
        super(message);

        this.token = token;
    }
}

export class SigmaNode {
    children = [];

    constructor({name, token}) {
        this.name = name;
        this.token = {...token};
    }

    add(node) {
        this.children.push(node);
    }
}

export class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.index = -1;
    }

    getNextToken() {
        const token = this.tokens[++this.index];

        if (!token) {
            throw new ParserError('Unexpected End of program', token);
        }

        return {...token};
    }

    parse() {
        if (!this.tokens.length) {
            throw new ParserError('No Code found');
        }

        const tree = new SigmaNode({
            name: '<signal-program>',
        });

        return this.parseProgram(tree);
    }

    parseProgram(tree) {
        let token = this.getNextToken();

        const node = new SigmaNode({
            name: '<program>'
        });

        if (token.value !== Keyword.PROGRAM) {
            throw new ParserError(`Program should start with ${Keyword.PROGRAM} keyword`);
        }
        node.add(new SigmaNode({token}));

        token = this.getNextToken();
        if (!TokenType.isIdentifier(token.type)) {
            throw new ParserError(`Program should have name`, token);
        }
        const procedure = new SigmaNode({name: '<procedure-identifier>'});
        const identifier = new SigmaNode({name: '<identifier>'});
        identifier.add(new SigmaNode({token}));
        procedure.add(identifier);
        node.add(procedure);

        token = this.getNextToken();
        if (token.value !== ';') {
            throw new ParserError('Wrong punctuation', token);
        }
        node.add(new SigmaNode({token}));

        this.parseBlock(node);

        token = this.getNextToken();
        if (token.value !== '.') {
            throw new ParserError('Program should end with dot', token);
        }
        node.add(new SigmaNode({token}));

        try {
            token = this.getNextToken();
        } catch (err) {
            tree.add(node);
            return tree;
        }

        throw new ParserError('Unexpected input after program end', token);
    }

    parseBlock(tree) {
        const node = new SigmaNode({
            name: '<block>'
        });

        let token = this.getNextToken();
        token = this.parseVariables(token, node);

        if (token.value !== Keyword.BEGIN) {
            throw new ParserError('Block should start with BEGIN keyword', token);
        }
        node.add(new SigmaNode({token}));

        token = this.getNextToken();
        if (token.value !== Keyword.END) {
            throw new ParserError('Block should end with END keyword', token);
        }
        node.add(new SigmaNode({token}));

        tree.add(node);
    }

    parseVariables(token, tree) {
        const node = new SigmaNode({
            name: '<variable-declarations>'
        });
        if (token.value === Keyword.VAR) {
            node.add(new SigmaNode({token}));
            token = this.parseDeclarations(node);
            tree.add(node);
        }

        if (token.value === Keyword.BEGIN) {
            return token;
        }

        throw new ParserError('Unexpected input', token);
    }


    parseDeclarationBlock(token, tree) {
        this.parseDeclaration(token, tree);
        return this.parseDeclarationsList(tree);
    }

    parseDeclarationsList(tree) {
        let token = this.getNextToken();
        if (token.value === ';') {
            return token;
        }

        if (token.value !== ',') {
            return token;
        }
        tree.add(new SigmaNode({token}));

        token = this.getNextToken();
        this.parseDeclaration(token, tree);
        return this.parseDeclarationsList(tree);
    }

    parseDeclaration(token, tree) {
        const node = new SigmaNode({name: '<variable>'});
        tree.add(node);
        if (!TokenType.isIdentifier(token.type)) {
            throw new ParserError('Identifier expected', token);
        }
        const identifier = new SigmaNode({name: '<identifier>'});
        identifier.add(new SigmaNode({token}));
        node.add(identifier);

        return token;
    }

    parseDeclarations(tree) {
        let token = this.getNextToken();
        if (!TokenType.isIdentifier(token.type)) {
            return token;
        }
        const node = new SigmaNode({name: '<declaration>'});
        tree.add(node);

        token = this.parseDeclarationBlock(token, node);

        if (token.value !== ':') {
            throw new ParserError('Variables should have types', token);
        }
        node.add(new SigmaNode({token}));

        token = this.parseAttributeBlock(node);

        if (token.value !== ';') {
            throw new ParserError('Punctuation error, `;` expected', token);
        }
        tree.add(new SigmaNode({token}));

        return this.parseDeclarations(tree);
    }

    parseAttributeBlock(tree) {
        let token = this.getNextToken();
        this.parseAttribute(token, tree);
        return this.parseAttributesList(tree);
    }

    parseAttributesList(tree) {
        let token = this.getNextToken();
        if (token.value === ';') {
            return token;
        }

        this.parseAttribute(token, tree);
        return this.parseAttributesList(tree);
    }

    parseAttribute(token, tree) {
        const node = new SigmaNode({name: '<attribute>'});
        tree.add(node);
        const isConstant = Constants.includes(token.value);

        if (!isConstant) {
            if (token.value === '[') {
                node.add(new SigmaNode({token}));
                return this.parseRangeBlock(node);
            } else {
                throw new ParserError('No Attribute type defined', token);
            }
        }
        node.add(new SigmaNode({token}));

        return token;
    }

    parseRangeBlock(tree) {
        let token = this.getNextToken();
        this.parseRange(token, tree);
        token = this.parseRangeList(tree);

        if (token.value === ']') {
            tree.add(new SigmaNode({token}));
            return token;
        }
    }

    parseRangeList(tree) {
        let token = this.getNextToken();
        if (token.value === ']') {
            return token;
        }

        if (token.value !== ',') {
            throw new ParserError('Comma missing in range list', token);
        }
        tree.add(new SigmaNode({token}));

        token = this.getNextToken();
        this.parseRange(token, tree);
        return this.parseRangeList(tree);
    }

    parseRange(token, tree) {
        const node = new SigmaNode({name: '<range>'});
        if (!TokenType.isNumber(token.type)) {
            throw new ParserError('Range should have numeric as first argument', token);
        }
        node.add(new SigmaNode({token}));

        token = this.getNextToken();
        if (token.value !== '..') {
            throw new ParserError('Range should have `..` between numbers', token);
        }
        node.add(new SigmaNode({token}));

        token = this.getNextToken();
        if (!TokenType.isNumber(token.type)) {
            throw new ParserError('Range should have numeric as second argument', token);
        }
        node.add(new SigmaNode({token}));
        tree.add(node);
    }
}