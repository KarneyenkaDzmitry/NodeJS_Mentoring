import { getMockReq, getMockRes } from "@jest-mock/express";
import { addUsersToGroup, createGroup, deleteGroup, getGroup, getGroups, updateGroup } from "../src/api/controllers/group.controller";
import { mockUsers } from "./mocks/users.mock";
import { mockGroups } from "./mocks/groups.mock";
import { Group } from "../src/data-access/orm/groups";
import { UserGroup } from "../src/data-access/orm/user_group";
import { sequelize } from "sequelize-test-helpers";
import { BadRequestError, NotFoundError, TransactionError } from "../src/models/errors/error.models";

jest.mock("../src/models/errors/error.models", () => {
    return { NotFoundError: jest.fn(), BadRequestError: jest.fn(), TransactionError: jest.fn() };
});
jest.mock("../src/data-access/sequelize", () => {});
jest.mock("../src/data-access/orm/groups", () => {
    return {
        Group: {},
    };
});

jest.mock("../src/data-access/orm/user_group", () => {
    return {
        UserGroup: {},
    };
});

jest.mock("../src/data-access/orm/users", () => {
    return {
        User: {},
    };
});

describe("[Group] controller", () => {
    let groups_limited_edition = [];
    const groupSubstring = "group";
    const limit = 3;
    const mock_create_group = mockGroups[0];
    delete mock_create_group.id;
    const mock_update_group = { ...mockGroups[4], id: undefined };
    delete mock_update_group.id;
    const add_users_to_group = { userIds: [mockUsers[2], mockUsers[3], mockUsers[4]], groupId: mockGroups[5] };
    const succeed_transaction = { number: 1, message: "Transaction completed" };
    const failure_transaction = { number: 0, message: "Transaction failed" };
    let mockReq;
    let mockRes;

    afterEach(async () => {
        jest.clearAllMocks();
        return mockRes.mockClear();
    });

    describe("[getGroup]", () => {
        describe("Group Exists", () => {
            beforeAll(() => {
                mockReq = getMockReq({ params: { id: mockGroups[0].id } });
                mockRes = getMockRes(mockGroups[0]);
                Group.findGroup = jest.fn().mockReturnValue(mockGroups[0]);
            });

            beforeEach(async () => {
                return getGroup(mockReq, mockRes.res, mockRes.next);
            });

            it("[findGroup] method of the [Group] model should be called", async () => {
                expect(Group.findGroup).toBeCalled();
                expect(Group.findGroup).toBeCalledWith(mockGroups[0].id);
                expect(Group.findGroup).toHaveReturnedWith(mockGroups[0]);
            });

            it("[Response] [status] and [json] should be called with expected args", () => {
                expect(mockRes.res.status).toBeCalledWith(200);
                expect(mockRes.res.json).toBeCalledWith(mockGroups[0]);
            });

            it("[Next] function should not be called", () => {
                expect(mockRes.next).not.toBeCalled();
            });
        });

        describe("Group does not exist", () => {
            beforeAll(() => {
                mockReq = getMockReq({ params: { id: mockGroups[0].id } });
                mockRes = getMockRes();
                Group.findGroup = jest.fn().mockReturnValue(null);
            });

            beforeEach(async () => {
                return getGroup(mockReq, mockRes.res, mockRes.next);
            });

            it("[findGroup] method of the [Group] model should be called", async () => {
                expect(Group.findGroup).toBeCalled();
                expect(Group.findGroup).toBeCalledWith(mockGroups[0].id);
                expect(Group.findGroup).toHaveReturnedWith(null);
            });

            it("[Response] [status] and [json] should not be called with expected args", () => {
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

    describe("[getGroups]", () => {
        describe("All Groups: queries [limit], [groupSubstring] undefined", () => {
            beforeAll(() => {
                mockReq = getMockReq();
                mockRes = getMockRes(mockGroups);
                Group.findGroups = jest.fn().mockReturnValue(mockGroups);
                Group.getAutoSuggestGroups = jest.fn();
            });

            beforeEach(async () => {
                return getGroups(mockReq, mockRes.res, mockRes.next);
            });

            it("[getGroups] method of the [Group] model should be called", async () => {
                expect(Group.findGroups).toBeCalled();
                expect(Group.findGroups).toBeCalledWith(0);
                expect(Group.findGroups).toHaveReturnedWith(mockGroups);
            });

            it("[getAutoSuggestGroups] method of the [Group] model should not be called", async () => {
                expect(Group.getAutoSuggestGroups).not.toBeCalled();
            });

            it("[Response] [status] and [json] should be called with expected args", () => {
                expect(mockRes.res.status).toBeCalledWith(200);
                expect(mockRes.res.json).toBeCalledWith(mockGroups);
            });

            it("[Next] function should not be called", () => {
                expect(mockRes.next).not.toBeCalled();
            });
        });

        describe(`Bunch of Groups: queries [limit] = ${limit}, [groupSubstring] undefined`, () => {
            beforeAll(() => {
                mockReq = getMockReq({ query: { limit: limit.toString() } });
                mockRes = getMockRes(mockGroups);
                groups_limited_edition = mockGroups.slice(0, limit);
                Group.findGroups = jest.fn().mockReturnValue(groups_limited_edition);
                Group.getAutoSuggestGroups = jest.fn();
            });

            beforeEach(async () => {
                return getGroups(mockReq, mockRes.res, mockRes.next);
            });

            it("[getGroups] method of the [Group] model should be called", async () => {
                expect(Group.findGroups).toBeCalled();
                expect(Group.findGroups).toBeCalledWith(limit);
                expect(Group.findGroups).toHaveReturnedWith(groups_limited_edition);
            });

            it("[getAutoSuggestGroups] method of the [Group] model should not be called", async () => {
                expect(Group.getAutoSuggestGroups).not.toBeCalled();
            });

            it("[Response] [status] and [json] should be called with expected args", () => {
                expect(mockRes.res.status).toBeCalledWith(200);
                expect(mockRes.res.json).toBeCalledWith(groups_limited_edition);
            });

            it("[Next] function should not be called", () => {
                expect(mockRes.next).not.toBeCalled();
            });
        });

        describe(`Bunch of Groups: queries [limit] = ${limit}, [groupSubstring] = ${groupSubstring}`, () => {
            beforeAll(() => {
                groups_limited_edition = mockGroups.filter((group) => group.name.includes(groupSubstring)).slice(0, limit);
                mockReq = getMockReq({ query: { limit: limit.toString(), groupSubstring } });
                mockRes = getMockRes(groups_limited_edition);
                Group.findGroups = jest.fn();
                Group.getAutoSuggestGroups = jest.fn().mockReturnValue(groups_limited_edition);
            });

            beforeEach(async () => {
                return getGroups(mockReq, mockRes.res, mockRes.next);
            });

            it("[getAutoSuggestGroups] method of the [Group] model should not be called", async () => {
                expect(Group.getAutoSuggestGroups).toBeCalled();
                expect(Group.getAutoSuggestGroups).toBeCalledWith(groupSubstring, limit);
                expect(Group.getAutoSuggestGroups).toHaveReturnedWith(groups_limited_edition);
            });

            it("[findGroups] method of the [Group] model should not be called", async () => {
                expect(Group.findGroups).not.toBeCalled();
            });

            it("[Response] [status] and [json] should be called with expected args", () => {
                expect(mockRes.res.status).toBeCalledWith(200);
                expect(mockRes.res.json).toBeCalledWith(groups_limited_edition);
            });

            it("[Next] function should not be called", () => {
                expect(mockRes.next).not.toBeCalled();
            });
        });

        describe(`Bunch of Users: queries [limit] undefined, [loginSubstring] = ${groupSubstring}`, () => {
            beforeAll(() => {
                groups_limited_edition = mockGroups;
                mockReq = getMockReq({ query: { groupSubstring } });
                mockRes = getMockRes(groups_limited_edition);
                Group.findGroups = jest.fn().mockReturnValue(groups_limited_edition);
                Group.getAutoSuggestGroups = jest.fn();
            });

            beforeEach(async () => {
                return getGroups(mockReq, mockRes.res, mockRes.next);
            });

            it("[getGroups] method of the [Group] model should be called", async () => {
                expect(Group.findGroups).toBeCalled();
                expect(Group.findGroups).toBeCalledWith(0);
                expect(Group.findGroups).toHaveReturnedWith(groups_limited_edition);
            });

            it("[getAutoSuggestGroups] method of the [Group] model should not be called", async () => {
                expect(Group.getAutoSuggestGroups).not.toBeCalled();
            });

            it("[Response] [status] and [json] should be called with expected args", () => {
                expect(mockRes.res.status).toBeCalledWith(200);
                expect(mockRes.res.json).toBeCalledWith(groups_limited_edition);
            });

            it("[Next] function should not be called", () => {
                expect(mockRes.next).not.toBeCalled();
            });
        });
    });

    describe("[createGroup]", () => {
        describe("Group with unique name", () => {
            beforeAll(() => {
                mockReq = getMockReq({ body: mock_create_group });
                mockRes = getMockRes(mockGroups[0]);
                Group.createGroup = jest.fn().mockReturnValue([mockGroups[0], true]);
            });

            beforeEach(async () => {
                return createGroup(mockReq, mockRes.res, mockRes.next);
            });

            it("[createGroup] method of the [Group] model should be called", async () => {
                expect(Group.createGroup).toBeCalled();
                expect(Group.createGroup).toBeCalledWith(mock_create_group);
                expect(Group.createGroup).toHaveReturnedWith([mockGroups[0], true]);
            });

            it("[Response] [status] and [json] should be called with expected args", () => {
                expect(mockRes.res.status).toBeCalledWith(200);
                expect(mockRes.res.json).toBeCalledWith(mockGroups[0]);
            });

            it("[Next] function should not be called", () => {
                expect(mockRes.next).not.toBeCalled();
            });
        });

        describe("Group with already existing name in DB", () => {
            beforeAll(() => {
                mock_create_group.name = mockGroups[3].name;
                mockReq = getMockReq({ body: mock_create_group });
                mockRes = getMockRes();
                Group.createGroup = jest.fn().mockReturnValue([mockGroups[3], false]);
            });

            beforeEach(async () => {
                return createGroup(mockReq, mockRes.res, mockRes.next);
            });

            it("[createGroup] method of the [Group] model should be called", async () => {
                expect(Group.createGroup).toBeCalled();
                expect(Group.createGroup).toBeCalledWith(mock_create_group);
                expect(Group.createGroup).toHaveReturnedWith([mockGroups[3], false]);
            });

            it("[Response] [status] and [json] should not be called", () => {
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

    describe("[updateGroup]", () => {
        describe("Update existing group", () => {
            beforeAll(() => {
                mockReq = getMockReq({ body: mock_update_group, params: { id: mockGroups[4].id } });
                mockRes = getMockRes();
                Group.updateGroup = jest.fn().mockReturnValue([1, [mockGroups[4]]]);
            });

            beforeEach(async () => {
                return updateGroup(mockReq, mockRes.res, mockRes.next);
            });

            it("[updateGroup] method of the [Group] model should be called", async () => {
                expect(Group.updateGroup).toBeCalled();
                expect(Group.updateGroup).toBeCalledWith(mockGroups[4]);
                expect(Group.updateGroup).toHaveReturnedWith([1, [mockGroups[4]]]);
            });

            it("[Response] [status] and [json] should be called with expected args", () => {
                expect(mockRes.res.status).toBeCalledWith(200);
                expect(mockRes.res.send).toBeCalled();
            });

            it("[Next] function should not be called", () => {
                expect(mockRes.next).not.toBeCalled();
            });
        });

        describe("Update nonexisting group", () => {
            beforeAll(() => {
                mockReq = getMockReq({ body: mock_update_group, params: { id: mockGroups[4].id } });
                mockRes = getMockRes();
                Group.updateGroup = jest.fn().mockReturnValue([0, []]);
            });

            beforeEach(async () => {
                return updateGroup(mockReq, mockRes.res, mockRes.next);
            });

            it("[updateGroup] method of the [Group] model should be called", async () => {
                expect(Group.updateGroup).toBeCalled();
                expect(Group.updateGroup).toBeCalledWith(mockGroups[4]);
                expect(Group.updateGroup).toHaveReturnedWith([0, []]);
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
        describe("Delete existing group", () => {
            beforeAll(() => {
                mockReq = getMockReq({
                    params: { id: mockGroups[3].id },
                });
                mockRes = getMockRes();
                Group.deleteGroup = jest.fn().mockReturnValue([1, []]);
            });

            beforeEach(async () => {
                return deleteGroup(mockReq, mockRes.res, mockRes.next);
            });

            it("[deleteGroup] method of the [Group] model should be called", async () => {
                expect(Group.deleteGroup).toBeCalled();
                expect(Group.deleteGroup).toBeCalledWith(mockGroups[3].id);
                expect(Group.deleteGroup).toHaveReturnedWith([1, []]);
            });

            it("[Response] [status] and [send] should be called with expected args", () => {
                expect(mockRes.res.status).toBeCalledWith(200);
                expect(mockRes.res.send).toBeCalled();
            });

            it("[Next] function should not be called", () => {
                expect(mockRes.next).not.toBeCalled();
            });
        });

        describe("Try to delete nonexisting group", () => {
            beforeAll(() => {
                mockReq = getMockReq({
                    params: { id: mockGroups[3].id },
                });
                mockRes = getMockRes();
                Group.deleteGroup = jest.fn().mockReturnValue([0, []]);
            });

            beforeEach(async () => {
                return deleteGroup(mockReq, mockRes.res, mockRes.next);
            });

            it("[deleteGroup] method of the [Group] model should be called", async () => {
                expect(Group.deleteGroup).toBeCalled();
                expect(Group.deleteGroup).toBeCalledWith(mockGroups[3].id);
                expect(Group.deleteGroup).toHaveReturnedWith([0, []]);
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

    describe("[addUsersToGroup]", () => {
        describe("Add users to group with success", () => {
            beforeAll(() => {
                mockReq = getMockReq({
                    body: add_users_to_group,
                });
                mockRes = getMockRes();
                UserGroup.addUsersToGroup = jest.fn().mockReturnValue(succeed_transaction);
            });

            beforeEach(async () => {
                return addUsersToGroup(mockReq, mockRes.res, mockRes.next);
            });

            it("[addUsersToGroup] method of the [UserGroup] model should be called", async () => {
                expect(UserGroup.addUsersToGroup).toBeCalled();
                expect(UserGroup.addUsersToGroup).toBeCalledWith(add_users_to_group.groupId, add_users_to_group.userIds);
                expect(UserGroup.addUsersToGroup).toHaveReturnedWith(succeed_transaction);
            });

            it("[Response] [status] and [json] should be called with expected args", () => {
                expect(mockRes.res.status).toBeCalledWith(200);
                expect(mockRes.res.json).toBeCalledWith(succeed_transaction);
            });

            it("[Next] function should not be called", () => {
                expect(mockRes.next).not.toBeCalled();
            });
        });

        describe("Add users to group with failure", () => {
            beforeAll(() => {
                mockReq = getMockReq({
                    body: add_users_to_group,
                });
                mockRes = getMockRes();
                UserGroup.addUsersToGroup = jest.fn().mockReturnValue(failure_transaction);
            });

            beforeEach(async () => {
                return addUsersToGroup(mockReq, mockRes.res, mockRes.next);
            });

            it("[addUsersToGroup] method of the [UserGroup] model should be called", async () => {
                expect(UserGroup.addUsersToGroup).toBeCalled();
                expect(UserGroup.addUsersToGroup).toBeCalledWith(add_users_to_group.groupId, add_users_to_group.userIds);
                expect(UserGroup.addUsersToGroup).toHaveReturnedWith(failure_transaction);
            });

            it("[Response] [status] and [send] should not be called", () => {
                expect(mockRes.res.status).not.toBeCalled();
                expect(mockRes.res.send).not.toBeCalled();
            });

            it("New instance of the [BadRequestError] should be created", () => {
                expect(TransactionError).toHaveBeenCalled();
            });

            it("[Next] function should be called", () => {
                expect(mockRes.next).toBeCalled();
            });
        });
    });
});
