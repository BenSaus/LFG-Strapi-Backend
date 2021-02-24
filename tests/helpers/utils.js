const request = require("supertest");

const call = (jwt, query, variables) => {
    return request(strapi.server)
        .post("/graphql")
        .send({
            query,
            variables,
        })
        .set("Authorization", "Bearer " + jwt)
        .set("Content-Type", "application/json")
        .set("accept", "application/json")
};

module.exports = {
    call
}