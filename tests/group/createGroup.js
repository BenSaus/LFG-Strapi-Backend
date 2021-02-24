const request = require("supertest");
const graphql = require("../helpers/graphql");

const strapiUser = require("../helpers/strapiUser");
const LFGActions = require("../helpers/lfgActions");
const mockData = require("./mockData");
const utils = require("../helpers/utils");

let testUser = null;
let testUsers = null;
let lfgActions = null;

beforeAll(async (done) => {
    lfgActions = new LFGActions(strapi);

    testUsers = strapiUser.getTestUsers();
    testUser = testUsers[0];

    done();
});

it("Create group", async (done) => {
    const variables = { ...mockData.createGroupData, leader: testUser.id };
    const resp = await utils.call(
        testUser.jwt,
        graphql.mutations.createGroup,
        variables
    );

    expect(resp.body.errors).toBeUndefined();
    expect(resp.body).toMatchSnapshot();
    done();
});

// TODO:
// it("Create group, error non-unique name")
// it("Create group, error member max invalid min")
// it("Create group, error member max invalid max")
// it("Create group, error age range invalid min")
// it("Create group, error age range invalid max")
