const request = require("supertest");
const graphql = require("../helpers/graphql");

const pullData = require("../helpers/strapiData");
const strapiUser = require("../helpers/strapiUser");
const lfgActions = require("../helpers/lfgActions");
const mockData = require("./mockData");

let testUser = null;
let strapiData = null;

const call = (query, variables) => {
    return request(strapi.server)
        .post("/graphql")
        .send({
            query,
            variables,
        })
        .set("Authorization", "Bearer " + testUser.jwt)
        .set("Content-Type", "application/json")
        .set("accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200); // Expects 200 but there could be a GraphQL error
};

beforeAll(async (done) => {
    testUser = await strapiUser.getTestUser();
    testUser2 = await strapiUser.getTestUser();

    strapiData = await pullData();
    done();
});

// NOTICE: Order matters when using snapshots
it("Get Groups", async (done) => {
    const query = `
        query {
            groups {
                id
                name
            }
        }
    `;

    const resp = await call(query).expect(200);
    expect(resp.body).toMatchSnapshot();

    done();
});

it("Create group", async (done) => {
    const variables = { ...mockData.createGroupData, leader: testUser.id };

    const resp = await call(graphql.mutations.createGroup, variables);

    expect(resp.body).toMatchSnapshot();

    done();
});

// it("Create group, error non-unique name")
// it("Create group, error member max invalid min")
// it("Create group, error member max invalid max")
// it("Create group, error age range invalid min")
// it("Create group, error age range invalid max")

it("Update group description", async (done) => {
    // create group through direct global strapi instance
    const group = await lfgActions.createGroup(
        strapi,
        mockData.updateDescriptionGroup,
        testUser
    );
    const variables = { id: group.id, description: "updated description" };

    const resp = await call(graphql.mutations.updateGroup, variables);

    expect(resp.body).toMatchSnapshot();
    done();
});

it("Update group name", async (done) => {
    const group = await lfgActions.createGroup(
        strapi,
        mockData.updateNameGroup,
        testUser
    );
    const variables = { id: group.id, name: "This is my updated group name" };

    const resp = await call(graphql.mutations.updateGroup, variables);

    expect(resp.body).toMatchSnapshot();
    done();
});

it("Update group name, error non-unique name", async (done) => {
    const groupA = await lfgActions.createGroup(
        strapi,
        mockData.updateNameAGroup,
        testUser
    );
    const groupB = await lfgActions.createGroup(
        strapi,
        mockData.updateNameBGroup,
        testUser
    );
    const variables = { id: groupB.id, name: groupA.name };

    const resp = await call(graphql.mutations.updateGroup, variables);

    const errors = resp.body.errors;
    expect(errors).toBeDefined();
    expect(errors[0].message).toBe("ValidationError");

    expect(resp.body).toMatchSnapshot();
    done();
});

it("Update group name, error empty name", async (done) => {
    const group = await lfgActions.createGroup(
        strapi,
        mockData.generalGroupData,
        testUser,
        "Error Empty Name"
    );
    const variables = { id: group.id, name: "" };

    const resp = await call(graphql.mutations.updateGroup, variables);

    const errors = resp.body.errors;
    expect(errors).toBeDefined();
    expect(errors[0].message).toBe("ValidationError");

    expect(resp.body).toMatchSnapshot();
    done();
});

it("Update group name, error one space name", async (done) => {
    const group = await lfgActions.createGroup(
        strapi,
        mockData.generalGroupData,
        testUser,
        "Error One Space Name"
    );
    const variables = { id: group.id, name: " " };

    const resp = await call(graphql.mutations.updateGroup, variables);

    const errors = resp.body.errors;
    expect(errors).toBeDefined();
    expect(errors[0].message).toBe("ValidationError");

    expect(resp.body).toMatchSnapshot();
    done();
});

it("Update group member max", async (done) => {
    const group = await lfgActions.createGroup(
        strapi,
        mockData.generalGroupData,
        testUser,
        "Update member max"
    );
    const variables = { id: group.id, member_max: 8 };

    const resp = await call(graphql.mutations.updateGroup, variables);

    const groupRespData = resp.body.data.updateGroup.group;
    expect(groupRespData.member_max).toBe(8);

    expect(resp.body).toMatchSnapshot();
    done();
});

it("Update group member max, error invalid member max", async (done) => {
    const group = await lfgActions.createGroup(
        strapi,
        mockData.generalGroupData,
        testUser,
        "Error Invalid member max"
    );
    const variables = { id: group.id, member_max: 1 };

    const resp = await call(graphql.mutations.updateGroup, variables);

    const errors = resp.body.errors;
    expect(errors).toBeDefined();
    expect(errors[0].message).toBe("ValidationError");

    expect(resp.body).toMatchSnapshot();
    done();
});

it("Update group member max, error invalid member max - max", async (done) => {
    const group = await lfgActions.createGroup(
        strapi,
        mockData.generalGroupData,
        testUser,
        "Error Invalid member max 31"
    );
    const variables = { id: group.id, member_max: 31 };

    const resp = await call(graphql.mutations.updateGroup, variables);

    const errors = resp.body.errors;
    expect(errors).toBeDefined();
    expect(errors[0].message).toBe("ValidationError");

    expect(resp.body).toMatchSnapshot();
    done();
});

// it("Update group room preference") ?? just ids
// it("Update group date time preference") ?? just ids
// it("Update group age range")
// it("Update group Validation")

// ONLY LEADER can update their own groups
it("Non-leader update, error not authorized", async (done) => {
    expect(false).toBe(true);
    done();
});

// it("Create group Validation")

// it("Cannot Close group with one or more members")
// it("Open group")
// it("Delete group")
// it("Remove member")
// ONLY LEADER and only my groups
