const strapiUser = require("../helpers/strapiUser");
const LFGActions = require("../helpers/lfgActions");
const mockData = require("../group/mockData");
const errorCodes = require("../../api/errorCodes");

const INVALID_ID = 999999;

let testUser = null;
let testUsers = null;
let lfgActions = null;

beforeAll(async (done) => {
    lfgActions = new LFGActions(strapi);

    testUsers = await strapiUser.getTestUsers();
    testUser = testUsers[0];

    done();
});

it("User Accept Invite", async (done) => {
    const testUser2 = testUsers[1];

    const { group } = await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "User Accept Invite"
    );

    const { invite } = await lfgActions.leaderCreateInvite(
        testUser,
        group.id,
        testUser2.id
    );

    const { group: groupPostAcceptInvite, errors } = await lfgActions.userAcceptInvite(
        testUser2,
        invite.id
    );

    expect(groupPostAcceptInvite).toBeDefined();
    expect(groupPostAcceptInvite.members.length).toBe(1);
    expect(groupPostAcceptInvite.members[0].id).toBe(testUser2.id.toString());

    done();
});

it("User accept invite, error invite already decided", async (done) => {
    const testUser2 = testUsers[1];

    const { group } = await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "Error invite already decided"
    );

    const { invite } = await lfgActions.leaderCreateInvite(
        testUser,
        group.id,
        testUser2.id
    );

    await lfgActions.userAcceptInvite(
        testUser2,
        invite.id
    );

    const { errors } = await lfgActions.userAcceptInvite(testUser2, invite.id);

    expect(errors[0]).toBeDefined();
    expect(errors[0].message).toBe(errorCodes.INVITE_ALREADY_DECIDED.message);
    expect(errors[0].extensions.exception.status).toBe(
        errorCodes.INVITE_ALREADY_DECIDED.code
    );

    done();
});

it("User accept invite, error invalid invite id", async (done) => {
    const testUser2 = testUsers[1];

    const { group } = await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "Error invalid invite id"
    );

    const { invite } = await lfgActions.leaderCreateInvite(
        testUser,
        group.id,
        testUser2.id
    );

    const { errors } = await lfgActions.userAcceptInvite(testUser2, INVALID_ID);

    expect(errors[0]).toBeDefined();
    expect(errors[0].message).toBe(errorCodes.INVITE_NOT_FOUND.message);
    expect(errors[0].extensions.exception.status).toBe(
        errorCodes.INVITE_NOT_FOUND.code
    );

    done();
});

it("User accept invite, error accept not authorized", async (done) => {
    const testUser2 = testUsers[1];
    const testUser3 = testUsers[2];

    const { group } = await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "error accept not authorized"
    );

    const { invite } = await lfgActions.leaderCreateInvite(
        testUser,
        group.id,
        testUser2.id
    );

    const { errors } = await lfgActions.userAcceptInvite(testUser3, invite.id);

    expect(errors[0]).toBeDefined();
    expect(errors[0].message).toBe(errorCodes.NOT_AUTHORIZED.message);
    expect(errors[0].extensions.exception.status).toBe(
        errorCodes.NOT_AUTHORIZED.code
    );

    done();
});

// TODO:
// Accept invite not intended for the user (not authorized)
// Accept invite that has already been decided on (not authorized)
//
