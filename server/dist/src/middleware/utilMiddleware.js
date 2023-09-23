"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerMiddleware = void 0;
const loggerMiddleware = (req, res, next) => {
    console.log(`Route: ${req.method} ${req.url}`);
    res.on('finish', () => {
        console.log(`Status Code: ${res.statusCode}`);
    });
    next();
};
exports.loggerMiddleware = loggerMiddleware;
//# sourceMappingURL=utilMiddleware.js.map