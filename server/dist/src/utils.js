"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeWhitespace = exports.getNextSequence = exports.getErrorMessage = void 0;
const diagram_model_1 = require("./models/diagram.model");
function getErrorMessage(error) {
    if (error instanceof Error)
        return error.message;
    return String(error);
}
exports.getErrorMessage = getErrorMessage;
async function getNextSequence() {
    const id = 'diagramId';
    const ret = await diagram_model_1.CounterModel.findByIdAndUpdate(id, { $inc: { seq: 1 } }, { new: true });
    if (!ret) {
        await diagram_model_1.CounterModel.create({ _id: id, seq: 1000 });
        return 1000;
    }
    return ret.seq;
}
exports.getNextSequence = getNextSequence;
function removeWhitespace(str) {
    return str.replace(/\s/g, '');
}
exports.removeWhitespace = removeWhitespace;
//# sourceMappingURL=utils.js.map