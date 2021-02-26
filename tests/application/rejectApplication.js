const strapiUser = require("../helpers/strapiUser");
const LFGActions = require("../helpers/lfgActions");
const errorCodes = require("../../api/errorCodes");
const mockData = require("../group/mockData");

const INVALID_ID = "999999";
const APPLICATION_STATUS_REJECTED = "rejected";

let testUser = null;
let testUsers = null;
let lfgActions = null;

beforeAll(async (done) => {
    lfgActions = new LFGActions(strapi);

    testUsers = await strapiUser.getTestUsers();
    testUser = testUsers[0];

    done();
});


it("Reject application", async (done) => {
    const testUser2 = testUsers[1];

    const { group } = await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "Reject application"
    );

    const message = "my message";
    const { application } = await lfgActions.userCreateApplication(
        testUser2,
        group.id,
        message
    );

    const { application: applicationPostReject, errors } = await lfgActions.leaderRejectApplication(application.id, testUser)

    expect(errors).toBeUndefined();
    expect(applicationPostReject).toBeDefined();
    expect(applicationPostReject.status).toBe(APPLICATION_STATUS_REJECTED);
    expect(applicationPostReject.message).toBe(message);
    expect(applicationPostReject.group.id).toBe(group.id);
    expect(applicationPostReject.applicant.id).toBe(testUser2.id.toString());

    done();
});

it("Reject application, error not leader", async (done) => {
    const testUser2 = testUsers[1];
    const testUser3 = testUsers[2];

    const { group } = await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "Error reject app not leader"
    );

    const message = "my message";
    const { application } = await lfgActions.userCreateApplication(
        testUser2,
        group.id,
        message
    );

    const { application: applicationPostReject, errors } = await lfgActions.leaderRejectApplication(application.id, testUser3)

    expect(applicationPostReject).toBeUndefined();

    expect(errors).toBeDefined();
    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe(errorCodes.NOT_AUTHORIZED.message);
    expect(errors[0].extensions.exception.status).toBe(
        errorCodes.NOT_AUTHORIZED.code
    );
    done();
});

it("Reject application, error app not found", async (done) => {
    const { group } = await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "Error reject app not found"
    );

    const { application: applicationPostReject, errors } = await lfgActions.leaderRejectApplication(INVALID_ID, testUser)
    
    expect(applicationPostReject).toBeUndefined();

    expect(errors).toBeDefined();
    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe(errorCodes.APPLICATION_NOT_FOUND.message);
    expect(errors[0].extensions.exception.status).toBe(
        errorCodes.APPLICATION_NOT_FOUND.code
    );

    done();
});