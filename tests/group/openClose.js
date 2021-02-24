const graphql = require("../helpers/graphql");

const strapiUser = require("../helpers/strapiUser");
const LFGActions = require("../helpers/lfgActions");
const mockData = require("./mockData");
const utils = require('../helpers/utils')

let testUser = null;
let testUsers = null;
let lfgActions = null;

beforeAll(async (done) => {
    lfgActions = new LFGActions(strapi);

    testUsers = strapiUser.getTestUsers();
    testUser = testUsers[0];

    done();
});


it("Open group", async (done) => {
    const { group } = await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "Open group"
    );

    // TODO: Close group here, then open

    const variables = { id: group.id, status: "open" };
    const resp = await utils.call(testUser.jwt, graphql.mutations.updateGroup, variables);
    
    const groupRespData = resp.body.data.updateGroup.group;
    expect(groupRespData.status).toBe("open");
    expect(true).toBe(false)

    done();
});


it("Close group", async (done) => {
    const { group } = await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "Close group"
    );

    const variables = { id: group.id, status: "closed" };
    const resp = await utils.call(testUser.jwt, graphql.mutations.updateGroup, variables);

    const groupRespData = resp.body.data.updateGroup.group;
    expect(groupRespData.status).toBe("closed");

    done();
});




// TODO:
// it("Cannot Close group with no members")