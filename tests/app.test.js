const { setupStrapi } = require("./helpers/strapi");
const { createTestUser, setupPermissions } = require("./helpers/strapi-user");

beforeAll(async (done) => {
    await setupStrapi();
    await createTestUser();
    await setupPermissions();
    done();
});

it("strapi is defined", () => {
    expect(strapi).toBeDefined();
});

require("./user");
require("./group/group");
