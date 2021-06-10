import { getMockReq, getMockRes } from "@jest-mock/express";
import { createUser, deleteUser, getUserById, getUsers, updateUser } from "../src/api/controllers/user.controller";
import { mockUsers } from "./mocks/users.mock";
import { User } from "../src/data-access/orm/users";
import { BadRequestError, NotFoundError } from "../src/models/errors/error.models";

jest.mock("../src/models/errors/error.models", () => {
    return { NotFoundError: jest.fn(), BadRequestError: jest.fn() };
});
jest.mock("../src/data-access/sequelize", () => {});
jest.mock("../src/data-access/orm/users", () => {
    return {
        User: {},
    };
});

describe("[User] controller", () => {
    let users_limited_edition = [];
    const loginSubstring = "urg";
    const limit = 5;
    const mock_create_user = mockUsers[0];
    delete mock_create_user.id;
    const mock_update_user = { ...mockUsers[4], id: undefined };
    delete mock_update_user.id;
    let mockReq;
    let mockRes;

    afterEach(async () => {
        jest.clearAllMocks();
        return mockRes.mockClear();
    });

    describe("[getUserById]", () => {
        describe("User Exists", () => {
            beforeAll(() => {
                mockReq = getMockReq({ params: { id: mockUsers[0].id } });
                mockRes = getMockRes(mockUsers[0]);
                User.findUser = jest.fn().mockReturnValue(mockUsers[0]);
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

            it("[Next] function should be called", () => {
                expect(mockRes.next).toBeCalled();
            });
        });
    });

    describe("[getUsers]", () => {
        describe("All Users: queries [limit], [loginSubstring] undefined", () => {
            beforeAll(() => {
                mockReq = getMockReq();
                mockRes = getMockRes(mockUsers);
                User.findUsers = jest.fn().mockReturnValue(mockUsers);
                User.getAutoSuggestUsers = jest.fn();
            });

            beforeEach(async () => {
                return getUsers(mockReq, mockRes.res, mockRes.next);
            });

            it("[findUsers] method of the [User] model should be called", async () => {
                expect(User.findUsers).toBeCalled();
                expect(User.findUsers).toBeCalledWith(0);
                expect(User.findUsers).toHaveReturnedWith(mockUsers);
            });

            it("[getAutoSuggestUsers] method of the [User] model should not be called", async () => {
                expect(User.getAutoSuggestUsers).not.toBeCalled();
            });

            it("[Response] [status] and [json] should be called with expected args", () => {
                expect(mockRes.res.status).toBeCalledWith(200);
                expect(mockRes.res.json).toBeCalledWith(mockUsers);
            });

            it("[Next] function should not be called", () => {
                expect(mockRes.next).not.toBeCalled();
            });
        });

        describe("Bunch of Users: queries [limit] = 5, [loginSubstring] undefined", () => {
            beforeAll(() => {
                mockReq = getMockReq({ query: { limit: limit.toString() } });
                mockRes = getMockRes(mockUsers);
                users_limited_edition = mockUsers.slice(0, limit);
                User.findUsers = jest.fn().mockReturnValue(users_limited_edition);
                User.getAutoSuggestUsers = jest.fn();
            });

            beforeEach(async () => {
                return getUsers(mockReq, mockRes.res, mockRes.next);
            });

            it("[findUsers] method of the [User] model should be called", async () => {
                expect(User.findUsers).toBeCalled();
                expect(User.findUsers).toBeCalledWith(5);
                expect(User.findUsers).toHaveReturnedWith(users_limited_edition);
            });

            it("[getAutoSuggestUsers] method of the [User] model should not be called", async () => {
                expect(User.getAutoSuggestUsers).not.toBeCalled();
            });

            it("[Response] [status] and [json] should be called with expected args", () => {
                expect(mockRes.res.status).toBeCalledWith(200);
                expect(mockRes.res.json).toBeCalledWith(users_limited_edition);
            });

            it("[Next] function should not be called", () => {
                expect(mockRes.next).not.toBeCalled();
            });
        });

        describe(`Bunch of Users: queries [limit] = "5", [loginSubstring] = "urg"`, () => {
            beforeAll(() => {
                mockReq = getMockReq({ query: { limit: limit.toString(), loginSubstring } });
                mockRes = getMockRes(mockUsers);
                users_limited_edition = mockUsers.filter((user) => user.login.includes(loginSubstring)).slice(0, limit);
                User.findUsers = jest.fn();
                User.getAutoSuggestUsers = jest.fn().mockReturnValue(users_limited_edition);
            });

            beforeEach(async () => {
                return getUsers(mockReq, mockRes.res, mockRes.next);
            });

            it("[getAutoSuggestUsers] method of the [User] model should be called", async () => {
                expect(User.getAutoSuggestUsers).toBeCalled();
                expect(User.getAutoSuggestUsers).toBeCalledWith(loginSubstring, limit);
                expect(User.getAutoSuggestUsers).toHaveReturnedWith(users_limited_edition);
            });

            it("[findUsers] method of the [User] model should not be called", async () => {
                expect(User.findUsers).not.toBeCalled();
            });

            it("[Response] [status] and [json] should be called with expected args", () => {
                expect(mockRes.res.status).toBeCalledWith(200);
                expect(mockRes.res.json).toBeCalledWith(users_limited_edition);
            });

            it("[Next] function should not be called", () => {
                expect(mockRes.next).not.toBeCalled();
            });
        });

        describe(`Bunch of Users: queries [limit] undefined, [loginSubstring] = "urg"`, () => {
            beforeAll(() => {
                mockReq = getMockReq({ query: { loginSubstring } });
                mockRes = getMockRes(mockUsers);
                users_limited_edition = mockUsers;
                User.findUsers = jest.fn().mockReturnValue(users_limited_edition);
                User.getAutoSuggestUsers = jest.fn();
            });

            beforeEach(async () => {
                return getUsers(mockReq, mockRes.res, mockRes.next);
            });

            it("[findUsers] method of the [User] model should be called", async () => {
                expect(User.findUsers).toBeCalled();
                expect(User.findUsers).toBeCalledWith(0);
                expect(User.findUsers).toHaveReturnedWith(users_limited_edition);
            });

            it("[getAutoSuggestUsers] method of the [User] model should not be called", async () => {
                expect(User.getAutoSuggestUsers).not.toBeCalled();
            });

            it("[Response] [status] and [json] should be called with expected args", () => {
                expect(mockRes.res.status).toBeCalledWith(200);
                expect(mockRes.res.json).toBeCalledWith(users_limited_edition);
            });

            it("[Next] function should not be called", () => {
                expect(mockRes.next).not.toBeCalled();
            });
        });
    });

    describe("[createUser]", () => {
        describe("User with unique login", () => {
            beforeAll(() => {
                mockReq = getMockReq({ body: mock_create_user });
                mockRes = getMockRes(mockUsers[0]);
                User.createUser = jest.fn().mockReturnValue([mockUsers[0], true]);
            });

            beforeEach(async () => {
                return createUser(mockReq, mockRes.res, mockRes.next);
            });

            it("[findUsers] method of the [User] model should be called", async () => {
                expect(User.createUser).toBeCalled();
                expect(User.createUser).toBeCalledWith(mock_create_user);
                expect(User.createUser).toHaveReturnedWith([mockUsers[0], true]);
            });

            it("[Response] [status] and [json] should be called with expected args", () => {
                expect(mockRes.res.status).toBeCalledWith(200);
                expect(mockRes.res.json).toBeCalledWith(mockUsers[0]);
            });

            it("[Next] function should not be called", () => {
                expect(mockRes.next).not.toBeCalled();
            });
        });

        describe("User with already existing login in DB", () => {
            beforeAll(() => {
                mock_create_user.login = mockUsers[3].login;
                mockReq = getMockReq({ body: mock_create_user });
                mockRes = getMockRes(mockUsers[0]);
                User.createUser = jest.fn().mockReturnValue([mockUsers[3], false]);
            });

            beforeEach(async () => {
                return createUser(mockReq, mockRes.res, mockRes.next);
            });

            it("[createUser] method of the [User] model should be called", async () => {
                expect(User.createUser).toBeCalled();
                expect(User.createUser).toBeCalledWith(mock_create_user);
                expect(User.createUser).toHaveReturnedWith([mockUsers[3], false]);
            });

            it("[Response] [status] and [json] should be called with expected args", () => {
                expect(mockRes.res.status).not.toBeCalled();
                expect(mockRes.res.json).not.toBeCalled();
            });

            it("New instance of the [BadRequestError] should be created", () => {
                expect(BadRequestError).toHaveBeenCalled();
            });

            it("[Next] function should not be called", () => {
                expect(mockRes.next).toBeCalled();
            });
        });
    });

    describe("[updateUser]", () => {
        describe("Update existing user", () => {
            beforeAll(() => {
                mockReq = getMockReq({ body: mock_update_user, params: { id: mockUsers[4].id } });
                mockRes = getMockRes();
                User.updateUser = jest.fn().mockReturnValue([1]);
            });

            beforeEach(async () => {
                return updateUser(mockReq, mockRes.res, mockRes.next);
            });

            it("[updateUser] method of the [User] model should be called", async () => {
                expect(User.updateUser).toBeCalled();
                expect(User.updateUser).toBeCalledWith(mockUsers[4]);
                expect(User.updateUser).toHaveReturnedWith([1]);
            });

            it("[Response] [status] and [json] should be called with expected args", () => {
                expect(mockRes.res.status).toBeCalledWith(200);
                expect(mockRes.res.send).toBeCalled();
            });

            it("[Next] function should not be called", () => {
                expect(mockRes.next).not.toBeCalled();
            });
        });

        describe("Update nonexisting user", () => {
            beforeAll(() => {
                mockReq = getMockReq({ body: mock_update_user, params: { id: mockUsers[4].id } });
                mockRes = getMockRes();
                User.updateUser = jest.fn().mockReturnValue([0]);
            });

            beforeEach(async () => {
                return updateUser(mockReq, mockRes.res, mockRes.next);
            });

            it("[updateUser] method of the [User] model should be called", async () => {
                expect(User.updateUser).toBeCalled();
                expect(User.updateUser).toBeCalledWith(mockUsers[4]);
                expect(User.updateUser).toHaveReturnedWith([0]);
            });

            it("[Response] [status] and [json] should not be called", () => {
                expect(mockRes.res.status).not.toBeCalled();
                expect(mockRes.res.send).not.toBeCalled();
            });

            it("New instance of the [BadRequestError] should be created", () => {
                expect(BadRequestError).toHaveBeenCalled();
            });

            it("[Next] function should be called", () => {
                expect(mockRes.next).toBeCalled();
            });
        });
    });

    describe("[deleteUser]", () => {
        describe("[Soft] deleting", () => {
            beforeAll(() => {
                mockReq = getMockReq({
                    query: { soft: "true" },
                    params: { id: mockUsers[3].id },
                });
                mockRes = getMockRes();
                User.deleteUser = jest.fn().mockReturnValue([1, []]);
            });

            beforeEach(async () => {
                return deleteUser(mockReq, mockRes.res, mockRes.next);
            });

            it("[deleteUser] method of the [User] model should be called", async () => {
                expect(User.deleteUser).toBeCalled();
                expect(User.deleteUser).toBeCalledWith(mockUsers[3].id, true);
                expect(User.deleteUser).toHaveReturnedWith([1, []]);
            });

            it("[Response] [status] and [send] should be called with expected args", () => {
                expect(mockRes.res.status).toBeCalledWith(200);
                expect(mockRes.res.send).toBeCalled();
            });

            it("[Next] function should not be called", () => {
                expect(mockRes.next).not.toBeCalled();
            });
        });

        describe("[Hard] deleting", () => {
            beforeAll(() => {
                mockReq = getMockReq({
                    query: { soft: "false" },
                    params: { id: mockUsers[3].id },
                });
                mockRes = getMockRes();
                User.deleteUser = jest.fn().mockReturnValue([1, [mockUsers[3]]]);
            });

            beforeEach(async () => {
                return deleteUser(mockReq, mockRes.res, mockRes.next);
            });

            it("[deleteUser] method of the [User] model should be called", async () => {
                expect(User.deleteUser).toBeCalled();
                expect(User.deleteUser).toBeCalledWith(mockUsers[3].id, false);
                expect(User.deleteUser).toHaveReturnedWith([1, [mockUsers[3]]]);
            });

            it("[Response] [status] and [send] should be called with expected args", () => {
                expect(mockRes.res.status).toBeCalledWith(200);
                expect(mockRes.res.send).toBeCalled();
            });

            it("[Next] function should not be called", () => {
                expect(mockRes.next).not.toBeCalled();
            });
        });

        describe("Try to delete nonexisting user", () => {
            beforeAll(() => {
                mockReq = getMockReq({
                    params: { id: mockUsers[3].id },
                });
                mockRes = getMockRes();
                User.deleteUser = jest.fn().mockReturnValue([0, []]);
            });

            beforeEach(async () => {
                return deleteUser(mockReq, mockRes.res, mockRes.next);
            });

            it("[deleteUser] method of the [User] model should be called", async () => {
                expect(User.deleteUser).toBeCalled();
                expect(User.deleteUser).toBeCalledWith(mockUsers[3].id, true);
                expect(User.deleteUser).toHaveReturnedWith([0, []]);
            });

            it("[Response] [status] and [send] should not be called", () => {
                expect(mockRes.res.status).not.toBeCalled();
                expect(mockRes.res.send).not.toBeCalled();
            });

            it("New instance of the [BadRequestError] should be created", () => {
                expect(BadRequestError).toHaveBeenCalled();
            });

            it("[Next] function should be called", () => {
                expect(mockRes.next).toBeCalled();
            });
        });
    });
});
