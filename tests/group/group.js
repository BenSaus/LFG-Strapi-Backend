const request = require("supertest");
const graphql = require("../helpers/graphql");

const strapiUser = require("../helpers/strapiUser");
const LFGActions = require("../helpers/lfgActions");
const mockData = require("./mockData");

const MIN_MAX_AGE = 1;
const MAX_MAX_AGE = 99;
const MIN_MIN_AGE = 1;
const MAX_MIN_AGE = 99;

let testUser = null;
let lfgActions = null;

beforeAll(async (done) => {
    lfgActions = new LFGActions(strapi)

    const testUsers = await strapiUser.getTestUsers();
    testUser = testUsers[0];

    done();
});

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

// TODO:
// it("Create group, error non-unique name")
// it("Create group, error member max invalid min")
// it("Create group, error member max invalid max")
// it("Create group, error age range invalid min")
// it("Create group, error age range invalid max")

it("Update group description", async (done) => {
    // create group through direct global strapi instance
    const group = await lfgActions.userCreateGroup(
        mockData.updateDescriptionGroup,
        testUser,
        "Update group description"
    );
    const variables = { id: group.id, description: "updated description" };

    const resp = await call(graphql.mutations.updateGroup, variables);
    expect(resp.body).toMatchSnapshot();

    done();
});

it("Update group name", async (done) => {
    const group = await lfgActions.userCreateGroup(
        mockData.updateNameGroup,
        testUser,
        "Update group name"
    );
    const variables = { id: group.id, name: "This is my updated group name" };

    const resp = await call(graphql.mutations.updateGroup, variables);
    expect(resp.body).toMatchSnapshot();

    done();
});

it("Update group name, error non-unique name", async (done) => {
    const groupA = await lfgActions.userCreateGroup(
        mockData.updateNameAGroup,
        testUser,
        "Update group name, error non-unique name A"
    );
    const groupB = await lfgActions.userCreateGroup(
        mockData.updateNameBGroup,
        testUser,
        "Update group name, error non-unique name B"
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
    const group = await lfgActions.userCreateGroup(
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
    const group = await lfgActions.userCreateGroup(
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
    const group = await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "Update group member max"
    );
    const variables = { id: group.id, member_max: 8 };

    const resp = await call(graphql.mutations.updateGroup, variables);

    const groupRespData = resp.body.data.updateGroup.group;
    expect(groupRespData.member_max).toBe(8);
    expect(resp.body).toMatchSnapshot();

    done();
});

it("Update group member max, error invalid member max", async (done) => {
    const group = await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "Error invalid member max - min"
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
    const group = await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "Error invalid member max - max"
    );
    const variables = { id: group.id, member_max: 31 };

    const resp = await call(graphql.mutations.updateGroup, variables);

    const errors = resp.body.errors;
    expect(errors).toBeDefined();
    expect(errors[0].message).toBe("ValidationError");
    expect(resp.body).toMatchSnapshot();

    done();
});

it("Update group min age", async (done) => {
    const group = await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "Update group min age"
    );
    const variables = { id: group.id, min_age: MIN_MIN_AGE };

    const resp = await call(graphql.mutations.updateGroup, variables);

    const groupRespData = resp.body.data.updateGroup.group;
    expect(groupRespData.min_age).toBe(MIN_MIN_AGE);
    expect(resp.body).toMatchSnapshot();

    done();
});

it("Update group max age", async (done) => {
    const group = await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "Update group max age"
    );
    const variables = { id: group.id, max_age: MAX_MAX_AGE };

    const resp = await call(graphql.mutations.updateGroup, variables);

    const groupRespData = resp.body.data.updateGroup.group;
    expect(groupRespData.max_age).toBe(MAX_MAX_AGE);
    expect(resp.body).toMatchSnapshot();

    done();
});

it("Update group room preference", async (done) => {
    const group = await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "Update group room preference"
    );
    const variables = { id: group.id, preferred_rooms: [1, 2] };

    const resp = await call(graphql.mutations.updateGroup, variables);

    const groupRespData = resp.body.data.updateGroup.group;
    expect(groupRespData.preferred_rooms[0].id).toBe("1"); // Note: ID's come back as strings
    expect(groupRespData.preferred_rooms[1].id).toBe("2");
    expect(resp.body).toMatchSnapshot();

    done();
});

it("Update group room preference, empty", async (done) => {
    const group = await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "Update room preference empty"
    );
    const variables = { id: group.id, preferred_rooms: [] };

    const resp = await call(graphql.mutations.updateGroup, variables);
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


// TODO:
// it("Open group")
// it("Delete group")
// it("Cannot Delete group with one or more members")
// it("Remove member")
// ONLY LEADER and only my groups

it("Close group", async (done) => {
    const group = await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "Close group"
    );

    const variables = { id: group.id, status: "closed" };
    const resp = await call(graphql.mutations.updateGroup, variables);

    const groupRespData = resp.body.data.updateGroup.group;
    expect(groupRespData.status).toBe("closed");

    done();
});

it("Open group", async (done) => {
    const group = await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "Open group"
    );

    const variables = { id: group.id, status: "open" };
    const resp = await call(graphql.mutations.updateGroup, variables);

    const groupRespData = resp.body.data.updateGroup.group;
    expect(groupRespData.status).toBe("open");

    done();
});



// TODO:
// it("Cannot Close group with no members")
