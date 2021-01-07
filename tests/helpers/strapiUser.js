const permData = require("./permissions");
const request = require("supertest");
const graphql = require("./graphql");

const mockUserData = {
    username: "testUser",
    email: "testUser@strapi.com",
    provider: "local",
    password: "1234abc",
    confirmed: true,
    blocked: null,
    hide_age: false,
    approved: true,
    role: null,
};

let instance;

async function createTestUser() {
    if (!instance) {
        const defaultRole = await strapi
            .query("role", "users-permissions")
            .findOne({}, []);

        const role = defaultRole ? defaultRole.id : null;

        /** Creates a new user an push to database */
        const user = await strapi.plugins[
            "users-permissions"
        ].services.user.add({
            ...mockUserData,
            username: "testUser",
            email: "testUser@strapi.com",
            role,
        });

        const jwt = strapi.plugins["users-permissions"].services.jwt.issue({
            id: user.id,
        });

        instance = user;
        instance.jwt = jwt;
    }

    return instance;
}

function getTestUser() {
    return instance;
}

async function loginAs(username, password) {
    const query = graphql.mutations.login;
    const resp = await request(strapi.server)
        .post("/graphql")
        .send({
            query: query,
            variables: {
                password: password,
                identifier: username,
                provider: "local",
            },
        })
        .set("Content-Type", "application/json")
        .set("accept", "application/json");

    return resp.body.data.login;
}

async function setAuthenticatedPermissions() {
    await strapi.plugins[
        "users-permissions"
    ].services.userspermissions.updateRole(
        1, // AuthenticatedId
        permData.authenticatedPermissions
    );
}
async function setPublicPermissions() {
    // allow all endpoints for public role
    await strapi.plugins[
        "users-permissions"
    ].services.userspermissions.updateRole(
        2, // PublicId
        permData.publicPermissions
    );
}

module.exports = {
    setAuthenticatedPermissions,
    setPublicPermissions,
    createTestUser,
    getTestUser,
    loginAs,
};
