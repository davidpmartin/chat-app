"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyRoutes = void 0;
const auth_route_1 = __importDefault(require("./auth.route"));
const data_route_1 = __importDefault(require("./data.route"));
// Exportable function to apply routes to the express app
function applyRoutes(app) {
    const apiPrefix = "/api";
    app.use(apiPrefix, auth_route_1.default);
    app.use(apiPrefix, data_route_1.default);
}
exports.applyRoutes = applyRoutes;
//# sourceMappingURL=index.route.js.map