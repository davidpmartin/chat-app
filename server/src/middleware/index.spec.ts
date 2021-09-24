import { Request, Response, NextFunction, response } from "express";
import mocha from "mocha";
import { expect } from "chai";
import sinon, { SinonStubbedInstance } from "sinon";
import { secured } from "./";

describe("Access control middleware", function() {
    
    // Set out fake objects
    const reqWithUser: any = { user: { uname: "fakeUser", pass: "fakePass" } };
    const reqWithoutUser: any = { };
    const res: any = { sendStatus(n: number) { return n } };
    const next: any = sinon.spy();

    // Stub the sendStatus function
    const stub = sinon.stub(res, "sendStatus");
    stub.withArgs(401).returns(401);
    
    // Test to check the middleware verifies the req.user object correctly
    it("should call next function when user object exists on req object", function() {
        secured(reqWithUser, res, next);
        sinon.assert.calledOnce(next);
    });

    // Test to check the authentication status of the client
    it("should call res send status with 401 when the user doesn't exist on req object", function() {
        const returnCode = secured(reqWithoutUser, res, next);
        sinon.assert.calledOnce(res.sendStatus);
        expect(returnCode).equals(401);
    });
})