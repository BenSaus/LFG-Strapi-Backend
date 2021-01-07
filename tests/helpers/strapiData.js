const request = require("supertest");

let instance;

async function strapiData(strapi, requestUser) {
    if (!instance) {
        const groups = await getGroups(strapi, requestUser);
        const users = await getUsers(strapi, requestUser);

        instance = {};
        instance.groups = groups;
        instance.users = users;
        instance.userByName = getUsersByName(users);
    }

    return instance;
}

async function getUsers(strapi, requestUser) {
    const query = `
        query {
            users{
                id
                username
            }
        }
    `;
    const resp = await request(strapi.server)
        .post("/graphql")
        .send({ query: query })
        .set("Authorization", "Bearer " + requestUser.jwt)
        .set("Content-Type", "application/json")
        .set("accept", "application/json");

    return resp.body.data.users;
}

function getUsersByName(users) {
    const result = {};

    for (let user of users) {
        result[user.username] = user;
    }

    return result;
}

async function getGroups(strapi, requestUser) {
    const query = `
        query {
            groups{
                id
                name
            }
        }
    `;

    const resp = await request(strapi.server)
        .post("/graphql")
        .send({ query: query })
        .set("Authorization", "Bearer " + requestUser.jwt)
        .set("Content-Type", "application/json")
        .set("accept", "application/json");

    return resp.body.data.groups;
}

module.exports = strapiData;
