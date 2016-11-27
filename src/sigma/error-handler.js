export class ErrorHandler {
    constructor() {
        this.errors = [];
    }

    recordError(error) {
        this.errors.push(error);
    }

    tolerate(error) {
        this.recordError(error);
    };

    constructError(msg, column) {
        let error = new Error(msg);
        try {
            throw error;
        } catch (base) {
            error = Object.create(base);
            Object.defineProperty(error, 'column', {value: column});
        } finally {
            return error;
        }

        return error;
    };

    createError(index, line, col, description) {
        const msg = 'Line ' + line + ': ' + description;
        const error = this.constructError(msg, col);
        error.index = index;
        error.lineNumber = line;
        error.description = description;
        return error;
    };

    throwError(index, line, col, description) {
        throw this.createError(index, line, col, description);
    };

    tolerateError(index, line, col, description) {
        const error = this.createError(index, line, col, description);
        this.recordError(error);
    };
}
