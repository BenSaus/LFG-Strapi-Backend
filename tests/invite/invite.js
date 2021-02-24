const strapiUser = require("../helpers/strapiUser");
const LFGActions = require("../helpers/lfgActions");
const mockData = require("../group/mockData");
const errorCodes = require("../../api/errorCodes")


const INVALID_ID = 9999999

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

// it("User accept invite, error already accepted", async (done) => {
//     const testUser2 = testUsers[1];

//     const { group } = await lfgActions.userCreateGroup(
//         mockData.generalGroupData,
//         testUser,
//         "Error invite already accepted"
//     );

//     const { invite } = await lfgActions.leaderCreateInvite(
//         testUser,
//         group.id,
//         testUser2.id
//     );

//     await lfgActions.userAcceptInvite(
//         testUser2,
//         invite.id
//     );
//     const { group: groupPostAcceptInvite } = await lfgActions.userAcceptInvite(
//         testUser2,
//         invite.id
//     );

//     // expect(errors).toBeDefined();
//     // expect(errors[0].message).toBe("ValidationError");

//     expect(groupPostAcceptInvite.members.length).toBe(1);
//     expect(groupPostAcceptInvite.members[0].id).toBe(testUser2.id.toString());

//     done();
// });

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
    expect(errors[0].message).toBe("Invite not found");
    expect(errors[0].extensions.exception.status).toBe(errorCodes.INVITE_NOT_FOUND);

    done();
});

// TODO:
// Accept invite not intended for the user (not authorized)
// Accept invite that has already been decided on (not authorized)
//
