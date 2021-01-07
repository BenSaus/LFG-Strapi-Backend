const request = require("supertest");
const graphql = require("../helpers/graphql");

const pullData = require("../helpers/strapiData");
const strapiUser = require("../helpers/strapiUser");
const strapiActions = require("../helpers/strapiActions");

const mockGroupData = {
    name: "Test Wombats",
    description: "Excepteur anim eiusmod ipsum ea enim.",
    member_max: 3,
    max_age: 83,
    min_age: 31,
    status: "open",
    members: [],
    preferred_rooms: [],
};

let testUser = null;
let strapiData = null;

beforeAll(async (done) => {
    testUser = await strapiUser.getTestUser();
    strapiData = await pullData();
    done();
});

it("Create group", async (done) => {
    const variables = { ...mockGroupData, leader: testUser.id };

    const resp = await request(strapi.server)
        .post("/graphql")
        .send({
            query: graphql.mutations.createGroup, // Even though this is a mutation it MUST be under the 'query' key
            variables: variables,
        })
        .set("Authorization", "Bearer " + testUser.jwt)
        .set("Content-Type", "application/json")
        .set("accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200);

    expect(resp.body).toMatchSnapshot();

    done();
});

it("Get Groups", async (done) => {
    const query = `
        query {
            groups {
                id
                name
            }
        }
    `;

    const resp = await request(strapi.server)
        .post("/graphql")
        .send({ query }) // NOTE: The query must be in brackets to work
        .set("Authorization", "Bearer " + testUser.jwt)
        .set("Content-Type", "application/json")
        .expect(200);

    expect(resp.body).toMatchSnapshot();

    done();
});

it("Create Invite", async (done) => {
    // Login
    const requestingUser = await strapiUser.loginAs("Ben", "123456");
    // Get data for invitee
    const userToInvite = strapiData.users[0];

    // Create group
    const group = await strapiActions.createGroup(
        strapi,
        mockGroupData,
        requestingUser
    );

    console.log("group", group);

    // Invite user to group
    const resp = await request(strapi.server)
        .post("/graphql")
        .send({
            query: graphql.mutations.createInvite,
            variables: {
                invitee: userToInvite.id,
                group: group.id,
                message: "Heya invite here",
            },
        }) // NOTE: The query must be in brackets to work
        .set("Authorization", "Bearer " + requestingUser.jwt)
        .set("Content-Type", "application/json")
        .expect(200);

    console.log(resp.body.data.createInvite);

    expect(resp.body).toMatchSnapshot();

    // console.log(resp.body.data);
    done();
});
