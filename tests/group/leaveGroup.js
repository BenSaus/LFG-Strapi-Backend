
const strapiUser = require("../helpers/strapiUser");
const LFGActions = require("../helpers/lfgActions");
const mockData = require("./mockData");

let testUser = null;
let testUsers = null;
let lfgActions = null;

beforeAll(async (done) => {
    lfgActions = new LFGActions(strapi);

    testUsers = await strapiUser.getTestUsers();
    testUser = testUsers[0];

    done();
});


it("Leave group", async (done) => {
    const testUser2 = testUsers[1];

    const { group } = await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "Leave group"
    );

    const { invite } = await lfgActions.leaderCreateInvite(
        testUser,
        group.id,
        testUser2.id
    );

    await lfgActions.userAcceptInvite(testUser2, invite.id);

    const { response, group: postGroup, errors } = await lfgActions.memberLeaveGroup(
        testUser2,
        group.id,
    );

    expect(errors).toBeUndefined();
    expect(postGroup).toBeDefined();
    expect(postGroup.members.length).toBe(0);

    done();
});


// TODO:
// Leave a group you are not in (Not Authorized)
// Leave a group that you are leader of
// Group not found