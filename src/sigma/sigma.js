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
    tokens.tables = Object.keys(Token).reduce((tables, name) => {
        return {...tables, [name]: getTables(tokens, Token[name])};
    }, {});

    return tokens;

    function getTable(id) {
        let index = id * 100;
        return (data, token) => {
            if (token.type !== TokenName[id]) {
                return data;
            }
            if (data[token.value]) {
                return data;
            }

            ++index;

            return {...data, [token.value]: index};
        }
    }

    function getTables(tokens, id) {
        return tokens.reduce(getTable(id), {});
    }
}
