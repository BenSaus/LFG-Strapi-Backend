const fs = require("fs");
const { setupStrapi } = require("./helpers/strapi");
const strapiUser = require("./helpers/strapiUser");
const loadStrapiData = require("./helpers/strapiData");

beforeAll(async (done) => {
    await setupStrapi();
    const testUsers = await strapiUser.createTestUsers();
    await strapiUser.setAuthenticatedPermissions();

    const loadedData = await loadStrapiData(strapi, testUsers.users[0]);
    done();
});

it("strapi is defined", () => {
    expect(strapi).toBeDefined();
});

// Include these test files
// WARNING: Changing the order here will alter create conflicts with snapshots because DB ids are sequential
require("./group/createGroup");
require("./group/openClose");
require("./group/removeMember");
require("./group/leaveGroup");
require("./group/updateGroup");
require("./invite/invite");
