export const Character = {
    isWhiteSpace(cp) {
        return (cp === 32)   // space
            || (cp === 9)    // tab
            || (cp === 11)   // vertical tab
            || (cp === 12)   // form feed
            || (cp === 160); // non breaking space
    },

    isLineTerminator(cp) {
        return (cp === 10)  // line feed
            || (cp === 13); // carriage return
    },

    isIdentifierStart(cp) {
        return (cp >= 65 && cp <= 90)   // A..Z
            || (cp >= 97 && cp <= 122); // a..z
    },

    isIdentifierPart(cp) {
        return (cp >= 65 && cp <= 90)   // A..Z
            || (cp >= 97 && cp <= 122)  // a..z
            || (cp >= 48 && cp <= 57);  // 0..9
    },

    isDigit(cp) {
        return (cp >= 48 && cp <= 57);  // 0..9
    },
};
