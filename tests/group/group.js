const request = require("supertest");
const { getTestUser } = require("../helpers/strapi-user");
const graphql = require("../helpers/graphql");

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

beforeAll(async (done) => {
    testUser = getTestUser();
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

    console.log(resp.body.data.groups);
    done();
});

// Requires users
// Requires created group
// Requires applications or invites accepted ??
// Requires group with members

// it("Remove Member", async (done) => {
//     const query = `
//     query {
//         groups {
//             id
//             name
//         }
//     }
//     `;

//     const resp = await request(strapi.server)
//         .post("/graphql")
//         .send({ query }) // NOTE: The query must be in brackets to work
//         .set("Authorization", "Bearer " + testUser.jwt)
//         .set("Content-Type", "application/json")
//         .expect(200);

//     expect(resp.body).toMatchSnapshot();

//     console.log(resp.body.data.groups);
//     done();
// });

// REST Tests
// it("Create group REST", async (done) => {
//   const resp = await request(strapi.server) // app server is an instance of Class: http.Server
//     .post("/groups")
//     .send(mockGroupData)
//     .set("Authorization", "Bearer " + testUser.jwt)
//     .set("Content-Type", "application/json")
//     .set("accept", "application/json")
//     .expect("Content-Type", /json/)
//     .expect(200);

//   console.log(resp.body);

//   expect(resp.body.id).toBeDefined();

//   done();
// });

// Get Groups REST
// it("Get Groups REST", async (done) => {
//     await request(strapi.server)
//       .get("/groups")
//       .set("accept", "application/json")
//       .set("Content-Type", "application/json")
//       .expect("Content-Type", /json/)
//       .expect(200)
//       .then((data) => {
//         //   console.log(data.body);
//       });

//     done();
//   });
