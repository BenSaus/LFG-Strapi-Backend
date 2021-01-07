const { setupStrapi } = require("./helpers/strapi");
const strapiUser = require("./helpers/strapiUser");
const loadStrapiData = require("./helpers/strapiData");

beforeAll(async (done) => {
    await setupStrapi();
    const testUser = await strapiUser.createTestUser();
    await strapiUser.setAuthenticatedPermissions();
    await loadStrapiData(strapi, testUser);
    done();
});

it("strapi is defined", () => {
    expect(strapi).toBeDefined();
});

require("./user");
require("./group/group");
