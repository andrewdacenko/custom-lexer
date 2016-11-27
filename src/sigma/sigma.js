import {Tokenizer} from './tokenizer';
import {Token, TokenName} from './token';

export function tokenize(code) {
    const tokenizer = new Tokenizer(code);

    let tokens;
    tokens = [];

    try {
        while (true) {
            let token = tokenizer.getNextToken();
            if (!token) {
                break;
            }
            tokens.push(token);
        }
    } catch (e) {
        tokenizer.errorHandler.tolerate(e);
    }

    tokens.errors = tokenizer.errors();
    tokens.tables = {
        Identifiers: tokens.reduce((data, token) => {
            if (token.type !== TokenName[Token.Identifier]) {
                return data;
            }
            return {items: {...data.items, [token.value]: ++data.index}, index: data.index};
        }, {items: {}, index: Token.Identifier * 100}).items,
        Numbers: tokens.reduce((data, token) => {
            if (token.type !== TokenName[Token.Number]) {
                return data;
            }
            return {items: {...data.items, [token.value]: ++data.index}, index: data.index};
        }, {items: {}, index: Token.Number * 100}).items
    };

    return tokens;
}
