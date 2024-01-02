"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const utilMiddleware_1 = require("./middleware/utilMiddleware");
const auth_1 = __importDefault(require("./routes/auth"));
const classes_1 = __importDefault(require("./routes/classes"));
const diagrams_1 = __importDefault(require("./routes/diagrams"));
const entity_1 = __importDefault(require("./routes/entity"));
const enums_1 = __importDefault(require("./routes/enums"));
const interfaces_1 = __importDefault(require("./routes/interfaces"));
const relationship_1 = __importDefault(require("./routes/relationship"));
const app = (0, express_1.default)();
// Middleware
const corsOptions = {
    origin: ['http://localhost:5173', 'https://uml2code.vercel.app'],
};
app.use((0, cors_1.default)(corsOptions));
app.options('*', (0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use((0, compression_1.default)());
app.use(utilMiddleware_1.loggerMiddleware);
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/diagram', diagrams_1.default);
app.use('/api/class', classes_1.default);
app.use('/api/interface', interfaces_1.default);
app.use('/api/enum', enums_1.default);
app.use('/api/entity', entity_1.default);
app.use('/api/relationship', relationship_1.default);
app.get('/', (req, res) => {
    res.send('Hello World from UML2Code Server!');
});
exports.default = app;
//# sourceMappingURL=app.js.map