const strapiUser = require("../helpers/strapiUser");
const LFGActions = require("../helpers/lfgActions");
const mockData = require("../group/mockData");

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

    const { group: groupPostAcceptInvite } = await lfgActions.userAcceptInvite(
        testUser2,
        invite.id
    );

    expect(groupPostAcceptInvite.members.length).toBe(1);
    expect(groupPostAcceptInvite.members[0].id).toBe(testUser2.id.toString());

    done();
});
