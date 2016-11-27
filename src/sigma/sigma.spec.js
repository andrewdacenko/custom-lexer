const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

import {tokenize} from './sigma';

describe('Sigma', () => {
    it('should tokenize complex program', () => {
        const code = `
PROGRAM something;
VAR hello, some:
    SIGNAL
    INTEGER
    [2 .. 5, 9 .. 18];
    (* 
    PROGRAM skipped;
    BEGIN END.
    *)
VAR kkk: FLOAT;
BEGIN END.
`;
        const tokens = tokenize(code);
        tokens.length.should.equal(28);
    });
});
