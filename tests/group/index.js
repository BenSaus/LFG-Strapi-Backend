const request = require("supertest");

const mockGroupData = {
  name: "Test Wombats",
  member_max: 3,
  max_age: 83,
  min_age: 31,
  description: "Excepteur anim eiusmod ipsum ea enim.",
  status: "open",
};

it("Create group REST", async (done) => {
  await request(strapi.server) // app server is an instance of Class: http.Server
    .post("/groups")
    .send(mockGroupData)
    .set("Content-Type", "application/json")
    .set("accept", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .then((data) => {
      expect(data.body.id).toBeDefined();
    });

  done();
});

it("Get Groups GraphQL", async (done) => {
  const query = `
    query {
        groups {
            id
            name
        }
    }
    `;
  const resp = await request(strapi.server)
    .post("/graphql")
    .send({ query }) // NOTE: The query must be in brackets to work
    .set("Content-Type", "application/json")
    .expect(200);

  expect(resp.body.data).toBeDefined();
  expect(resp.body.data.groups).toBeDefined();

  //   console.log(resp.body);
  //   console.log(resp.body.data.groups);
  //   console.dir(resp.body, { depth: null });
  done();
});

// Get Groups REST
it("Get Groups REST", async (done) => {
  await request(strapi.server)
    .get("/groups")
    .set("accept", "application/json")
    .set("Content-Type", "application/json")
    .expect("Content-Type", /json/)
    .expect(200)
    .then((data) => {
      //   console.log(data.body);
    });

  done();
});
