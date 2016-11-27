const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

import {Scanner} from './scanner';
import {Token} from './token';
import {Keyword} from './keyword';
import {Message} from './message';

describe('Scanner', () => {
    let sut;
    let env;
    let code;
    let handler;

    beforeEach(() => {
        env = sinon.sandbox.create();
        code = '';
        handler = {
            throwError: env.stub(),
            tolerateError: env.stub()
        };
    });

    afterEach(() => {
        env.restore();
    });

    it('should set all params', () => {
        sut = new Scanner(code, handler);

        sut.should.deep.equal({
            source: code,
            errorHandler: handler,
            trackComment: false,
            length: code.length,
            index: 0,
            lineNumber: 0,
            lineStart: 0
        });
    });

    describe('#eof', () => {
        it('should be true when empty code', () => {
            sut = new Scanner(code, handler);
            sut.eof().should.equal(true);
        });

        it('should be false when not empty code', () => {
            sut = new Scanner(code + 's', handler);
            sut.eof().should.equal(false);
        });

        it('should be false when meet end of program', () => {
            code = '1';
            sut = new Scanner(code, handler);
            sut.index = code.length;
            sut.eof().should.equal(true);
        });
    });

    describe('#trowUnexpectedToken', () => {
        it('should handle error', () => {
            sut = new Scanner(code, handler);
            sut.throwUnexpectedToken();

            handler.throwError.should.calledWith(
                0,
                0,
                1,
                Message.UnexpectedToken
            )
        });
    });

    describe('#isKeyword', () => {
        it('should return false when id is not Keyword', () => {
            Scanner.isKeyword('some').should.equal(false);
        });

        it('should return true when one of Keyword', () => {
            [
                Keyword.PROGRAM, Keyword.BEGIN,
                Keyword.END, Keyword.VAR
            ].forEach((keyword) => {
                Scanner.isKeyword(keyword).should.equal(true);
            });
        });
    });

    describe('#scanNumber', () => {
        it('should return number when valid number is in code', () => {
            const expected = ['1', '223', '4', '623'];
            [
                '1',
                '223 ',
                '4',
                '623..'
            ].forEach((source, index) => {
                sut = new Scanner(code, handler);
                sut.source = source;
                sut.scanNumber().should.deep.equal({
                    value: expected[index],
                    type: Token.Number,
                    lineNumber: 0,
                    lineStart: 0,
                    start: 0,
                    end: expected[index].length
                });
            });
        })

        it('should throw error when identifier start met', () => {
            sut = new Scanner(code, handler);
            sut.source = '123a';
            sut.scanNumber();
            handler.throwError.should.calledWith(
                3,
                0,
                4,
                Message.UnexpectedToken
            );
        })
    });

    describe('#lex', () => {
        it('should return EOF token when no content', () => {
            sut = new Scanner(code, handler);
            sut.lex().should.deep.equal({
                type: Token.EOF,
                lineNumber: 0,
                lineStart: 0,
                start: 0,
                end: 0
            });
        });
    });
});
