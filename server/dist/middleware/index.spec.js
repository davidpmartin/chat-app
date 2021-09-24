"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon_1 = __importDefault(require("sinon"));
const _1 = require("./");
describe("Access control middleware", function () {
    // Set out fake objects
    const reqWithUser = { user: { uname: "fakeUser", pass: "fakePass" } };
    const reqWithoutUser = {};
    const res = { sendStatus(n) { return n; } };
    const next = sinon_1.default.spy();
    // Stub the sendStatus function
    const stub = sinon_1.default.stub(res, "sendStatus");
    stub.withArgs(401).returns(401);
    // Test to check the middleware verifies the req.user object correctly
    it("should call next function when user object exists on req object", function () {
        (0, _1.secured)(reqWithUser, res, next);
        sinon_1.default.assert.calledOnce(next);
    });
    // Test to check the authentication status of the client
    it("should call res send status with 401 when the user doesn't exist on req object", function () {
        const returnCode = (0, _1.secured)(reqWithoutUser, res, next);
        sinon_1.default.assert.calledOnce(res.sendStatus);
        (0, chai_1.expect)(returnCode).equals(401);
    });
});
//# sourceMappingURL=index.spec.js.map