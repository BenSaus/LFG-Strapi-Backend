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

// NOTE: Doesn't seem to work. Used rm command in npm script instead
// afterAll(async done => {
//     const dbSettings = strapi.config.get('database.connections.default.settings');
//     //delete test database after all tests
//     if (dbSettings && dbSettings.filename) {
//       const tmpDbFile = `${__dirname}/../${dbSettings.filename}`;
//       if (fs.existsSync(tmpDbFile)) {
//         fs.unlinkSync(tmpDbFile);
//       }
//     }
//     done();
//   });

it("strapi is defined", () => {
    expect(strapi).toBeDefined();
});

// Include these test files
// require("./user");
require("./group/group");
require("./invite/invite");
