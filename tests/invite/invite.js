// it("Create Invite", async (done) => {
//     // Login
//     const requestingUser = await strapiUser.loginAs("Ben", "123456");
//     // Get data for invitee
//     const userToInvite = strapiData.users[0];

//     // Create group
//     const group = await strapiActions.createGroup(
//         strapi,
//         mockGroupData,
//         requestingUser
//     );

//     console.log("group", group);

//     // Invite user to group
//     const resp = await request(strapi.server)
//         .post("/graphql")
//         .send({
//             query: graphql.mutations.createInvite,
//             variables: {
//                 invitee: userToInvite.id,
//                 group: group.id,
//                 message: "Heya invite here",
//             },
//         }) // NOTE: The query must be in brackets to work
//         .set("Authorization", "Bearer " + requestingUser.jwt)
//         .set("Content-Type", "application/json")
//         .expect(200);

//     console.log(resp.body.data.createInvite);

//     expect(resp.body).toMatchSnapshot();

//     done();
// });
