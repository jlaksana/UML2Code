"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeWhitespace = exports.getErrorMessage = void 0;
function getErrorMessage(error) {
    if (error instanceof Error)
        return error.message;
    return String(error);
}
exports.getErrorMessage = getErrorMessage;
function removeWhitespace(str) {
    return str.replace(/\s/g, '');
}
exports.removeWhitespace = removeWhitespace;
//# sourceMappingURL=utils.js.map