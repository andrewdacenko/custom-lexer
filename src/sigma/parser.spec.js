import {Parser} from './parser';
import {tokenize} from './sigma';

describe.only('Parser', () => {
    it('should fail when no PROGRAM at start', () => {
        const tokens = tokenize(`q PROGRAM a; BEGIN END.`);
        const parser = new Parser(tokens);

        (() => parser.parse()).should.throw();
    });

    it('should fail when no identifier next to PROGRAM', () => {
        const tokens = tokenize(`PROGRAM; BEGIN END.`);
        const parser = new Parser(tokens);

        (() => parser.parse()).should.throw();
    });

    it('should parse simplest ever program', () => {
        const tokens = tokenize(`PROGRAM a; BEGIN END.`);
        const parser = new Parser(tokens);
        parser.parse();
    });

    it('should parse program with empty declarations', () => {
        const tokens = tokenize(`
            PROGRAM a;
            VAR
            BEGIN END.
        `);

        const parser = new Parser(tokens);
        parser.parse();
    });

    it('should parse program with one declaration', () => {
        const tokens = tokenize(`
            PROGRAM a;
            VAR a: [1..2] ;
            BEGIN END.
        `);

        const parser = new Parser(tokens);
        parser.parse();
    });

    it('should parse program with one declaration and range as type', () => {
        const tokens = tokenize(`
            PROGRAM a;
            VAR a: SIGNAL;
            BEGIN END.
        `);

        const parser = new Parser(tokens);
        parser.parse();
    });

    it('should parse program with multiple variables', () => {
        const tokens = tokenize(`
            PROGRAM a;
            VAR a, b1, c3: 
                SIGNAL 
                FLOAT 
                [ 12..22
                , 33..22
                ];
            BEGIN END.
        `);

        const parser = new Parser(tokens);
        parser.parse();
    });

    it('should parse program with multiple var declarations', () => {
        const tokens = tokenize(`
            PROGRAM a;
            VAR a, b1, c3: 
                SIGNAL 
                FLOAT 
                [ 12..22
                , 33..22
                ];
            VAR k: INTEGER;
            BEGIN END.
        `);

        const parser = new Parser(tokens);
        parser.parse();
    });

    it('should fail program with multiple', () => {
        const tokens = tokenize(`
            PROGRAM a;
            VAR a, b1, c3: 
                SIGNAL 
                FLOAT 
                [ 12..22
                , 33..22
                ];
            VAR k INTEGER;
            BEGIN END.
        `);

        const parser = new Parser(tokens);
        (() => {
            parser.parse();
        }).should.throw();
    });
});
