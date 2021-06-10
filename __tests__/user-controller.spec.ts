import { getMockReq, getMockRes } from "@jest-mock/express";
import { getUserById } from "../src/api/controllers/user.controller";
// import { sequelize } from "sequelize-test-helpers";
import { mockUsers } from "./mocks/users.mock";
import { User } from "../src/data-access/orm/users";
import { NotFoundError } from "../src/models/errors/error.models";

let mockReq;
let mockRes;

jest.mock("../src/data-access/sequelize", () => {});
jest.mock("../src/models/errors/error.models", () => {
    return { NotFoundError: jest.fn() };
});

// BadRequestError: jest.fn().mockReturnValue({}),
jest.mock("../src/data-access/orm/users", () => {
    return {
        User: {},
    };
});
User.findUser = jest.fn().mockReturnValue(mockUsers[0]);

describe("Controller [getUserById]", () => {
    describe("User Exists", () => {
        beforeAll(() => {
            mockReq = getMockReq({ params: { id: mockUsers[0].id } });
            mockRes = getMockRes(mockUsers[0]);
        });

        beforeEach(async () => {
            return getUserById(mockReq, mockRes.res, mockRes.next);
        });

        it("[findUser] method of the [User] model should be called", async () => {
            expect(User.findUser).toBeCalled();
            expect(User.findUser).toBeCalledWith(mockUsers[0].id);
            expect(User.findUser).toHaveReturnedWith(mockUsers[0]);
        });

        it("[Response] [status] and [json] should be called with expected args", () => {
            expect(mockRes.res.status).toBeCalledWith(200);
            expect(mockRes.res.json).toBeCalledWith(mockUsers[0]);
        });

        it("[Next] function should not be called", () => {
            expect(mockRes.next).not.toBeCalled();
        });

        afterEach(async () => {
            return mockRes.mockClear();
        });
    });

    describe("User does not exist", () => {
        beforeAll(() => {
            mockReq = getMockReq({ params: { id: mockUsers[1].id } });
            mockRes = getMockRes();
            User.findUser = jest.fn().mockReturnValue(null);
        });

        beforeEach(async () => {
            return getUserById(mockReq, mockRes.res, mockRes.next);
        });

        it("[findUser] method of the [User] model should be called", async () => {
            expect(User.findUser).toBeCalled();
            expect(User.findUser).toBeCalledWith(mockUsers[1].id);
            expect(User.findUser).toHaveReturnedWith(null);
        });

        it("[Response] [status] and [json] should not be called", () => {
            expect(mockRes.res.status).not.toBeCalled();
            expect(mockRes.res.json).not.toBeCalled();
        });

        it("New instance of the [NotFoundError] should be created", () => {
            expect(NotFoundError).toHaveBeenCalled();
        });

        it("[Next] function should not be called", () => {
            expect(mockRes.next).toBeCalled();
        });

        afterEach(async () => {
            return mockRes.mockClear();
        });
    });
});
