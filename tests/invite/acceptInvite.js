const strapiUser = require("../helpers/strapiUser");
const LFGActions = require("../helpers/lfgActions");
const mockData = require("../group/mockData");
const errorCodes = require("../../api/errorCodes");

const INVALID_ID = 999999;
const INVITE_STATUS_ACCEPTED = "accepted";
const INVITE_STATUS_REJECTED = "rejected";

let testUser = null;
let testUsers = null;
let lfgActions = null;

beforeAll(async (done) => {
    lfgActions = new LFGActions(strapi);

    testUsers = await strapiUser.getTestUsers();
    testUser = testUsers[0];

    done();
});

it("Accept Invite", async (done) => {
    const testUser2 = testUsers[1];

    const { group } = await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "Accept Invite"
    );

    const message = "hello message"

    const { invite ,errors:inviteErrors } = await lfgActions.leaderCreateInvite(
        testUser,
        group.id,
        testUser2.id,
        message
    );

    const {
        invite: invitePostAccept,
        errors,
    } = await lfgActions.userAcceptInvite(testUser2, invite.id);

    expect(errors).toBeUndefined();

    expect(invitePostAccept).toBeDefined();
    expect(invitePostAccept.status).toBe(INVITE_STATUS_ACCEPTED);
    expect(invitePostAccept.invitee.id).toBe(testUser2.id.toString());
    expect(invitePostAccept.message).toBe(message);
    expect(invitePostAccept.group_leader_dismissed).toBe(false);
    
    expect(invitePostAccept.group).toBeDefined();
    expect(invitePostAccept.group.id).toBe(group.id);
    expect(invitePostAccept.group.members.length).toBe(1);
    expect(invitePostAccept.group.members[0].id).toBe(testUser2.id.toString());

    done();
});

it("Accept invite, error invite already decided", async (done) => {
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

    await lfgActions.userAcceptInvite(testUser2, invite.id);

    const { errors } = await lfgActions.userAcceptInvite(testUser2, invite.id);

    expect(errors).toBeDefined();
    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe(errorCodes.INVITE_ALREADY_DECIDED.message);
    expect(errors[0].extensions.exception.status).toBe(
        errorCodes.INVITE_ALREADY_DECIDED.code
    );

    done();
});

it("Accept invite, error invalid invite id", async (done) => {
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

    expect(errors).toBeDefined();
    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe(errorCodes.INVITE_NOT_FOUND.message);
    expect(errors[0].extensions.exception.status).toBe(
        errorCodes.INVITE_NOT_FOUND.code
    );

    done();
});

it("Accept invite, error accept not authorized", async (done) => {
    const testUser2 = testUsers[1];
    const testUser3 = testUsers[2];

    const { group } = await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "Error accept not authorized"
    );

    const { invite } = await lfgActions.leaderCreateInvite(
        testUser,
        group.id,
        testUser2.id
    );

    const { errors } = await lfgActions.userAcceptInvite(testUser3, invite.id);

    expect(errors).toBeDefined();
    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe(errorCodes.NOT_AUTHORIZED.message);
    expect(errors[0].extensions.exception.status).toBe(
        errorCodes.NOT_AUTHORIZED.code
    );

    done();
});

it("Accept invite, error group is closed", async (done) => {
    const testUser2 = testUsers[1];

    const { group } = await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "Error accept invite closed"
    );

    const { invite } = await lfgActions.leaderCreateInvite(
        testUser,
        group.id,
        testUser2.id
    );

    await lfgActions.leaderCloseGroup(testUser, group.id);

    const { errors } = await lfgActions.userAcceptInvite(testUser2, invite.id);

    expect(errors).toBeDefined();
    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe(errorCodes.GROUP_NOT_OPEN.message);
    expect(errors[0].extensions.exception.status).toBe(
        errorCodes.GROUP_NOT_OPEN.code
    );

    done();
});



// TODO:
// Accept invite not intended for the user (not authorized)
// Accept invite that has already been decided on (not authorized)
//
