const strapiUser = require("../helpers/strapiUser");
const LFGActions = require("../helpers/lfgActions");
const errorCodes = require("../../api/errorCodes");
const mockData = require("../group/mockData");

const INVALID_ID = "999999";
const APPLICATION_STATUS_UNDECIDED = "undecided";

let testUser = null;
let testUsers = null;
let lfgActions = null;

beforeAll(async (done) => {
    lfgActions = new LFGActions(strapi);

    testUsers = await strapiUser.getTestUsers();
    testUser = testUsers[0];

    done();
});

it("Create application", async (done) => {
    const testUser2 = testUsers[1];

    const { group } = await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "Create application"
    );

    const message = "my message";
    const { application, errors } = await lfgActions.userCreateApplication(
        testUser2,
        group.id,
        message
    );

    expect(errors).toBeUndefined();
    expect(application).toBeDefined();
    expect(application.status).toBe(APPLICATION_STATUS_UNDECIDED);
    expect(application.message).toBe(message);
    expect(application.group.id).toBe(group.id);
    expect(application.applicant.id).toBe(testUser2.id.toString());

    done();
});

it("Create application, error duplicate", async (done) => {
    const testUser2 = testUsers[1];

    const { group } = await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "Error app, duplicate"
    );

    const message = "my message";
    await lfgActions.userCreateApplication(testUser2, group.id, message);
    const { application, errors } = await lfgActions.userCreateApplication(
        testUser2,
        group.id,
        message
    );

    expect(application).toBeUndefined();

    expect(errors).toBeDefined();
    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe(
        errorCodes.APPLICATION_ALREADY_EXISTS.message
    );
    expect(errors[0].extensions.exception.status).toBe(
        errorCodes.APPLICATION_ALREADY_EXISTS.code
    );

    done();
});

it("Create application, error already a member", async (done) => {
    const testUser2 = testUsers[1];

    const { group } = await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "Error app, already member"
    );

    const { invite } = await lfgActions.leaderCreateInvite(
        testUser,
        group.id,
        testUser2.id
    );

    await lfgActions.userAcceptInvite(testUser2, invite.id);

    const { application, errors } = await lfgActions.userCreateApplication(
        testUser2,
        group.id
    );

    expect(application).toBeUndefined();

    expect(errors).toBeDefined();
    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe(errorCodes.ALREADY_A_MEMBER.message);
    expect(errors[0].extensions.exception.status).toBe(
        errorCodes.ALREADY_A_MEMBER.code
    );

    done();
});

it("Create application, error you are the leader", async (done) => {
    const { group } = await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "Error app, user is leader"
    );

    const { application, errors } = await lfgActions.userCreateApplication(
        testUser,
        group.id
    );

    expect(application).toBeUndefined();

    expect(errors).toBeDefined();
    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe(errorCodes.NOT_AUTHORIZED.message);
    expect(errors[0].extensions.exception.status).toBe(
        errorCodes.NOT_AUTHORIZED.code
    );

    done();
});


it("Create application, error invite exists", async (done) => {
    const testUser2 = testUsers[1];

    const { group } = await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "Error app, invite exists"
    );

    await lfgActions.leaderCreateInvite(
        testUser,
        group.id,
        testUser2.id
    );

    const { application, errors } = await lfgActions.userCreateApplication(
        testUser2,
        group.id
    );

    expect(application).toBeUndefined();

    expect(errors).toBeDefined();
    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe(errorCodes.USER_ALREADY_INVITED.message);
    expect(errors[0].extensions.exception.status).toBe(
        errorCodes.USER_ALREADY_INVITED.code
    );

    done();
});


it("Create application, error group is closed", async (done) => {
    const testUser2 = testUsers[1];

    const { group } = await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "Error app, group closed"
    );
    
    await lfgActions.leaderCloseGroup(testUser, group.id);

    const { application, errors } = await lfgActions.userCreateApplication(
        testUser2,
        group.id
    );

    expect(application).toBeUndefined();

    expect(errors).toBeDefined();
    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe(errorCodes.GROUP_NOT_OPEN.message);
    expect(errors[0].extensions.exception.status).toBe(
        errorCodes.GROUP_NOT_OPEN.code
    );

    done();
});


it("Create application, error group not found", async (done) => {
    const testUser2 = testUsers[1];

    const { group } = await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "Error app, group not found"
    );
    
    const { application, errors } = await lfgActions.userCreateApplication(
        testUser2,
        INVALID_ID
    );

    expect(application).toBeUndefined();

    expect(errors).toBeDefined();
    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe(errorCodes.GROUP_NOT_FOUND.message);
    expect(errors[0].extensions.exception.status).toBe(
        errorCodes.GROUP_NOT_FOUND.code
    );

    done();
});