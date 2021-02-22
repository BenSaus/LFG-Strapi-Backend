const fs = require('fs')
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
