
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


it("Remove member", async (done) => {
    const testUser2 = testUsers[1];

    const { group } = await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "Remove member"
    );

    const { invite } = await lfgActions.leaderCreateInvite(
        testUser,
        group.id,
        testUser2.id
    );

    await lfgActions.userAcceptInvite(testUser2, invite.id);

    const { group: postGroup } = await lfgActions.leaderRemoveMember(
        testUser,
        group.id,
        testUser2.id
    );

    expect(postGroup.members.length).toBe(0);

    done();
});


// TODO:
// Remove a member of a group you are not the leader of (Not Authorized)
// Remove a non existant member (Member not found)
// Remove a user that is not a member of the group (Member not found)
// Member not found
// Group not found