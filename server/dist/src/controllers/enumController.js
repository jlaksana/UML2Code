"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editEnum = exports.createEnum = void 0;
const zod_1 = require("zod");
const diagram_model_1 = require("../models/diagram.model");
const entity_model_1 = require("../models/entity.model");
const utils_1 = require("../utils");
const entityServices_1 = require("./entityServices");
const enumData = zod_1.z.object({
    name: zod_1.z.string().nonempty(),
    values: zod_1.z
        .array(zod_1.z.object({ id: zod_1.z.number(), name: zod_1.z.string().nonempty() }))
        .min(1),
});
const validateEnum = async (data, diagramId) => {
    if (diagramId === undefined) {
        throw new Error('Must provide a diagram id');
    }
    const parseResult = enumData.safeParse(data);
    if (!parseResult.success) {
        throw new Error('Invalid - Ensure all fields are present and valid. Must have at least one value');
    }
    else {
        // query for the diagram
        try {
            const diagram = await diagram_model_1.DiagramModel.findById(diagramId);
            if (!diagram) {
                throw new Error();
            }
        }
        catch (e) {
            throw new Error(`Could not find a diagram with the given id: ${diagramId}`);
        }
    }
    return parseResult.data;
};
const createEnum = async (data, diagramId) => {
    const validatedEnum = await validateEnum(data, diagramId);
    const name = await (0, entityServices_1.validateDuplicateEntity)(validatedEnum.name, diagramId);
    try {
        const entity = new entity_model_1.EntityModel({
            diagramId,
            type: 'enum',
            data: {
                name,
                constants: validatedEnum.values.map((value) => ({
                    id: value.id,
                    name: (0, utils_1.removeWhitespace)(value.name).toUpperCase(),
                    type: 'string',
                })),
            },
        });
        await entity.save();
        return (0, entityServices_1.reformatEnum)(entity);
    }
    catch (e) {
        console.log(e);
        throw new Error('Could not create an enum');
    }
};
exports.createEnum = createEnum;
const editEnum = async (enumId, diagramId, data) => {
    const validatedEnum = await validateEnum(data, diagramId);
    try {
        await (0, entityServices_1.validateDuplicateEntity)(validatedEnum.name, diagramId, enumId);
        const updatedEnum = await entity_model_1.EntityModel.findByIdAndUpdate(enumId, {
            data: {
                name: validatedEnum.name,
                constants: validatedEnum.values.map((value) => ({
                    id: value.id,
                    name: (0, utils_1.removeWhitespace)(value.name).toUpperCase(),
                    type: 'string',
                })),
            },
        }, { new: true });
        if (!updatedEnum) {
            throw new Error();
        }
        return (0, entityServices_1.reformatEnum)(updatedEnum);
    }
    catch (e) {
        console.log(e);
        throw new Error(`Could not update an enum with the given id: ${enumId}`);
    }
};
exports.editEnum = editEnum;
//# sourceMappingURL=enumController.js.map