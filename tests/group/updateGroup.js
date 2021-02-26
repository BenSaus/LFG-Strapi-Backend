const request = require("supertest");
const graphql = require("../helpers/graphql");

const strapiUser = require("../helpers/strapiUser");
const LFGActions = require("../helpers/lfgActions");
const mockData = require("./mockData");
const utils = require("../helpers/utils");

const MIN_MAX_AGE = 1;
const MAX_MAX_AGE = 99;
const MIN_MIN_AGE = 1;
const MAX_MIN_AGE = 99;

let testUser = null;
let testUsers = null;
let lfgActions = null;

beforeAll(async (done) => {
    lfgActions = new LFGActions(strapi);

    testUsers = strapiUser.getTestUsers();
    testUser = testUsers[0];

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

    const resp = await utils.call(testUser.jwt, query).expect(200);

    expect(resp.body).toMatchSnapshot();
    done();
});



it("Update group description", async (done) => {
    // create group through direct global strapi instance
    const { group } = await lfgActions.userCreateGroup(
        mockData.updateDescriptionGroup,
        testUser,
        "Update group description"
    );

    const variables = { id: group.id, description: "updated description" };
    const resp = await utils.call(
        testUser.jwt,
        graphql.mutations.updateGroup,
        variables
    );

    expect(resp.body).toMatchSnapshot();
    done();
});

it("Update group name", async (done) => {
    const { group } = await lfgActions.userCreateGroup(
        mockData.updateNameGroup,
        testUser,
        "Update group name"
    );

    const variables = { id: group.id, name: "This is my updated group name" };
    const resp = await utils.call(
        testUser.jwt,
        graphql.mutations.updateGroup,
        variables
    );

    expect(resp.body).toMatchSnapshot();
    done();
});

it("Update group name, error non-unique name", async (done) => {
    const { group: groupA } = await lfgActions.userCreateGroup(
        mockData.updateNameAGroup,
        testUser,
        "Error non-unique name A"
    );
    
    const { group: groupB } = await lfgActions.userCreateGroup(
        mockData.updateNameBGroup,
        testUser,
        "Error non-unique name B"
    );

    const variables = { id: groupB.id, name: groupA.name };
    const resp = await utils.call(
        testUser.jwt,
        graphql.mutations.updateGroup,
        variables
    );
    const errors = resp.body.errors;

    expect(errors).toBeDefined();
    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe("ValidationError");
    expect(resp.body).toMatchSnapshot();
    done();
});

it("Update group name, error empty name", async (done) => {
    const { group } = await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "Error Empty Name"
    );

    const variables = { id: group.id, name: "" };
    const resp = await utils.call(
        testUser.jwt,
        graphql.mutations.updateGroup,
        variables
    );
    const errors = resp.body.errors;

    expect(errors).toBeDefined();
    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe("ValidationError");
    expect(resp.body).toMatchSnapshot();
    done();
});

it("Update group name, error one space name", async (done) => {
    const { group } = await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "Error one space name"
    );

    const variables = { id: group.id, name: " " };
    const resp = await utils.call(
        testUser.jwt,
        graphql.mutations.updateGroup,
        variables
    );
    const errors = resp.body.errors;

    expect(errors).toBeDefined();
    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe("ValidationError");
    expect(resp.body).toMatchSnapshot();
    done();
});

it("Update group member max", async (done) => {
    const { group } = await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "Update group member max"
    );

    const variables = { id: group.id, member_max: 8 };
    const resp = await utils.call(
        testUser.jwt,
        graphql.mutations.updateGroup,
        variables
    );
    const groupRespData = resp.body.data.updateGroup.group;

    expect(groupRespData.member_max).toBe(8);
    expect(resp.body).toMatchSnapshot();
    done();
});

it("Update group member max, error invalid member max", async (done) => {
    const { group } = await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "Error invalid member max - min"
    );

    const variables = { id: group.id, member_max: 1 };
    const resp = await utils.call(
        testUser.jwt,
        graphql.mutations.updateGroup,
        variables
    );
    const errors = resp.body.errors;

    expect(errors).toBeDefined();
    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe("ValidationError");
    expect(resp.body).toMatchSnapshot();
    done();
});

it("Update group member max, error invalid member max - max", async (done) => {
    const { group } = await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "Error invalid member max - max"
    );

    const variables = { id: group.id, member_max: 31 };
    const resp = await utils.call(
        testUser.jwt,
        graphql.mutations.updateGroup,
        variables
    );
    const errors = resp.body.errors;

    expect(errors).toBeDefined();
    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe("ValidationError");
    expect(resp.body).toMatchSnapshot();
    done();
});

it("Update group min age", async (done) => {
    const { group } = await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "Update group min age"
    );

    const variables = { id: group.id, min_age: MIN_MIN_AGE };
    const resp = await utils.call(
        testUser.jwt,
        graphql.mutations.updateGroup,
        variables
    );
    const groupRespData = resp.body.data.updateGroup.group;

    expect(groupRespData.min_age).toBe(MIN_MIN_AGE);
    expect(resp.body).toMatchSnapshot();
    done();
});

it("Update group max age", async (done) => {
    const { group } = await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "Update group max age"
    );

    const variables = { id: group.id, max_age: MAX_MAX_AGE };
    const resp = await utils.call(
        testUser.jwt,
        graphql.mutations.updateGroup,
        variables
    );
    const groupRespData = resp.body.data.updateGroup.group;

    expect(groupRespData.max_age).toBe(MAX_MAX_AGE);
    expect(resp.body).toMatchSnapshot();
    done();
});

it("Update group room preference", async (done) => {
    const { group } = await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "Update group room preference"
    );

    const variables = { id: group.id, preferred_rooms: [1, 2] };
    const resp = await utils.call(
        testUser.jwt,
        graphql.mutations.updateGroup,
        variables
    );
    const groupRespData = resp.body.data.updateGroup.group;

    expect(groupRespData.preferred_rooms[0].id).toBe("1"); // Note: ID's come back as strings
    expect(groupRespData.preferred_rooms[1].id).toBe("2");
    expect(resp.body).toMatchSnapshot();
    done();
});

it("Update group room preference, empty", async (done) => {
    const { group } = await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "Update room preference empty"
    );

    const variables = { id: group.id, preferred_rooms: [] };
    const resp = await utils.call(
        testUser.jwt,
        graphql.mutations.updateGroup,
        variables
    );
    const groupRespData = resp.body.data.updateGroup.group;

    expect(groupRespData.preferred_rooms.length).toBe(0);
    expect(resp.body).toMatchSnapshot();
    done();
});

// TODO:
// it("Update group date time preference") ?? just ids
// it("Update group Validation")

// ONLY LEADER can update their own groups
it("Non-leader update, error not authorized", async (done) => {
    expect(false).toBe(true);
    done();
});

