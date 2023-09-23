"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./db"));
dotenv_1.default.config();
const start = (port) => {
    try {
        app_1.default.listen(port, () => {
            console.log(`Server listening on ${port}`);
        });
        (0, db_1.default)();
    }
    catch (err) {
        console.error(err);
        process.exit();
    }
};
start(parseInt(process.env.PORT || '5000', 10));
//# sourceMappingURL=index.js.map