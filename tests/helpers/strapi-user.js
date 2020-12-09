const permData = require("./permissions");

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

async function setupPermissions() {
    // allow all endpoints for public role
    //   await strapi.plugins[
    //     "users-permissions"
    //   ].services.userspermissions.updateRole(
    //     2, // PublicId
    //     permData.publicPermissions
    //   );

    await strapi.plugins[
        "users-permissions"
    ].services.userspermissions.updateRole(
        1, // AuthenticatedId
        permData.authenticatedPermissions
    );
}

function getTestUser() {
    return instance;
}

module.exports = { setupPermissions, createTestUser, getTestUser };

// const permData = require("./permissions");

// it("should return users data for authenticated user", async (done) => {
//   // update role
//   await strapi.plugins[
//     "users-permissions"
//   ].services.userspermissions.updateRole(2, permData.data);

//   const resp = await strapi.plugins[
//     "users-permissions"
//   ].services.userspermissions.getRoles();

//   console.dir(resp, { depth: null });

//   /** Gets the default user role */
//   const defaultRole = await strapi
//     .query("role", "users-permissions")
//     .findOne({}, []);

//   const role = defaultRole ? defaultRole.id : null;
//   console.log(defaultRole);

//   /** Creates a new user an push to database */
//   const user = await strapi.plugins["users-permissions"].services.user.add({
//     ...mockUserData,
//     username: "tester2",
//     email: "tester2@strapi.com",
//     role,
//   });

//   const jwt = strapi.plugins["users-permissions"].services.jwt.issue({
//     id: user.id,
//   });

//   await request(strapi.server) // app server is an instance of Class: http.Server
//     .get("/groups/count")
//     .set("accept", "application/json")
//     .set("Content-Type", "application/json")
//     .expect("Content-Type", /json/)
//     .expect(200)
//     .then((data) => {
//       console.log("count", data.body);
//       expect(data.body).toBeDefined();
//       //   expect(data.body.id).toBe(user.id);
//       //   expect(data.body.username).toBe(user.username);
//       //   expect(data.body.email).toBe(user.email);
//     });

//   done();
// });
