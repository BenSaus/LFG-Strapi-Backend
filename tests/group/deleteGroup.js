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



// TODO:
// it("Delete group")
// it("Cannot Delete group with one or more members")
// ONLY LEADER and only my groups
