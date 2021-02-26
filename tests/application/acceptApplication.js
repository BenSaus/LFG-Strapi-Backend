const strapiUser = require("../helpers/strapiUser");
const LFGActions = require("../helpers/lfgActions");
const errorCodes = require("../../api/errorCodes");
const mockData = require("../group/mockData");

const INVALID_ID = "999999";
const APPLICATION_STATUS_ACCEPTED = "accepted";

let testUser = null;
let testUsers = null;
let lfgActions = null;

beforeAll(async (done) => {
    lfgActions = new LFGActions(strapi);

    testUsers = await strapiUser.getTestUsers();
    testUser = testUsers[0];

    done();
});

it("Accept application", async (done) => {
    const testUser2 = testUsers[1];

    const { group } = await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "Accept application"
    );

    const { application } = await lfgActions.userCreateApplication(
        testUser2,
        group.id
    );

    const {
        application: acceptedApplication,
        errors,
    } = await lfgActions.leaderAcceptApplication(application.id, testUser);

    expect(errors).toBeUndefined();

    expect(acceptedApplication).toBeDefined();
    expect(acceptedApplication.status).toBe(APPLICATION_STATUS_ACCEPTED);

    // User is added to group
    expect(acceptedApplication.group.members[0]).toBeDefined();
    expect(acceptedApplication.group.members[0].id).toBe(testUser2.id.toString());

    done();
});


it("Accept application, error application not found", async (done) => {
    await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "Accept error app not found"
    );

    const {
        application: acceptedApplication,
        errors,
    } = await lfgActions.leaderAcceptApplication(INVALID_ID, testUser);

    expect(acceptedApplication).toBeUndefined();

    expect(errors).toBeDefined();
    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe(errorCodes.APPLICATION_NOT_FOUND.message)
    expect(errors[0].extensions.exception.status).toBe(errorCodes.APPLICATION_NOT_FOUND.code)

    done();
});


it("Accept application, error already member", async (done) => {
    const testUser2 = testUsers[1];

    const { group } = await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "Accept error already member"
    );

    const { application } = await lfgActions.userCreateApplication(
        testUser2,
        group.id
    );

    await lfgActions.leaderAcceptApplication(application.id, testUser);


    const {
        application: acceptedApplication,
        errors,
    } = await lfgActions.leaderAcceptApplication(application.id, testUser);

    expect(acceptedApplication).toBeUndefined();
    
    expect(errors).toBeDefined();
    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe(errorCodes.ALREADY_A_MEMBER.message)
    expect(errors[0].extensions.exception.status).toBe(errorCodes.ALREADY_A_MEMBER.code)

    done();
});


it("Accept application, error not leader", async (done) => {
    const testUser2 = testUsers[1];
    const testUser3 = testUsers[2];

    const { group } = await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "Accept error not leader"
    );

    const { application } = await lfgActions.userCreateApplication(
        testUser2,
        group.id
    );

    const {
        application: acceptedApplication,
        errors,
    } = await lfgActions.leaderAcceptApplication(application.id, testUser3);

    expect(acceptedApplication).toBeUndefined();
    
    expect(errors).toBeDefined();
    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe(errorCodes.NOT_AUTHORIZED.message)
    expect(errors[0].extensions.exception.status).toBe(errorCodes.NOT_AUTHORIZED.code)

    done();
});
