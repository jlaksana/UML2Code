"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editInterface = exports.createInterface = void 0;
const entity_model_1 = require("../models/entity.model");
const utils_1 = require("../utils");
const entityServices_1 = require("./entityServices");
const createInterface = async (data, diagramId) => {
    const validatedData = await (0, entityServices_1.validateEntity)(data, diagramId);
    await (0, entityServices_1.validateDuplicateEntity)(validatedData.name, diagramId);
    if (validatedData.attributes) {
        throw new Error('Invalid - Ensure all fields are present and valid');
    }
    try {
        const entity = new entity_model_1.EntityModel({
            diagramId,
            type: 'interface',
            data: {
                name: (0, utils_1.removeWhitespace)(validatedData.name),
                constants: validatedData.constants?.map((constant) => ({
                    ...constant,
                    name: (0, utils_1.removeWhitespace)(constant.name),
                })),
                methods: validatedData.methods?.map((method) => ({
                    ...method,
                    name: (0, utils_1.removeWhitespace)(method.name),
                })),
            },
        });
        await entity.save();
        // reformat the entity for client
        return (0, entityServices_1.reformatInterface)(entity);
    }
    catch (e) {
        console.log(e);
        throw new Error('Could not create an interface');
    }
};
exports.createInterface = createInterface;
const editInterface = async (interfaceId, diagramId, data) => {
    const validatedData = await (0, entityServices_1.validateEntity)(data, diagramId);
    try {
        await (0, entityServices_1.validateDuplicateEntity)(validatedData.name, diagramId, interfaceId);
        const updatedInterface = await entity_model_1.EntityModel.findByIdAndUpdate(interfaceId, {
            data: validatedData,
        }, { new: true });
        if (!updatedInterface) {
            throw new Error();
        }
        return (0, entityServices_1.reformatInterface)(updatedInterface);
    }
    catch (e) {
        console.log(e);
        throw new Error(`Could not update an interface with the given id: ${interfaceId}`);
    }
};
exports.editInterface = editInterface;
//# sourceMappingURL=interfaceController.js.map