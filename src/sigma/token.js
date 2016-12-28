export const Token = {
    EOF: 0,
    Punctuator: 1,
    MultiPunctuator: 2,
    Keyword: 4,
    Number: 5,
    Comment: 6,
    Identifier: 10
};

export const TokenName = {
    [Token.EOF]: 'EOF',
    [Token.Identifier]: 'Identifier',
    [Token.Keyword]: 'Keyword',
    [Token.Number]: 'Number',
    [Token.Punctuator]: 'Punctuator',
    [Token.MultiPunctuator]: 'MultiPunctuator',
    [Token.Comment]: 'Comment'
};

export const TokenType = {
    isIdentifier(type) {
        return TokenName[Token.Identifier] === type;
    },
    isKeyword(type) {
        return TokenName[Token.Keyword] === type;
    },
    isNumber(type) {
        return TokenName[Token.Number] === type;
    },
    isPunctuator(type) {
        return TokenName[Token.Punctuator] === type;
    },
    isMultiPunctuator(type) {
        return TokenName[Token.MultiPunctuator] === type;
    }
};
