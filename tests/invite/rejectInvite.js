const strapiUser = require("../helpers/strapiUser");
const LFGActions = require("../helpers/lfgActions");
const mockData = require("../group/mockData");
const errorCodes = require("../../api/errorCodes");

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


it("Reject invite", async (done) => {
    const testUser2 = testUsers[1];

    const { group } = await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "Reject invite"
    );

    const { invite } = await lfgActions.leaderCreateInvite(
        testUser,
        group.id,
        testUser2.id
    );

    const {
        invite: invitePostReject,
        errors,
    } = await lfgActions.userRejectInvite(testUser2, invite.id);

    expect(errors).toBeUndefined();
    expect(invitePostReject).toBeDefined();
    expect(invitePostReject.status).toBe(INVITE_STATUS_REJECTED);

    done();
});


// invalid invite id
// not authorized, it's not your invite
// 