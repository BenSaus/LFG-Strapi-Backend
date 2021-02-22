const request = require("supertest");
const graphql = require("./graphql");

// WARNING: TODO: Passing leader information here is temporary until the create group endpoint is updated
// Note: Group names must be unique so I added the optional name parameter
async function createGroup(strapi, groupData, leaderUser, name=null) {
    const modGroupData = {...groupData}
    if(name !== null) [
        modGroupData.name = name
    ]

    const variables = { ...modGroupData, leader: leaderUser.id };

    const resp = await request(strapi.server)
        .post("/graphql")
        .send({
            query: graphql.mutations.createGroup, // Even though this is a mutation it MUST be under the 'query' key
            variables: variables,
        })
        .set("Authorization", "Bearer " + leaderUser.jwt)
        .set("Content-Type", "application/json")
        .set("accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200);

    return resp.body.data.createGroup.group;
}

async function createInvite() {}

async function createApplication() {}

module.exports = {
    createGroup,
    createInvite,
    createApplication,
};
