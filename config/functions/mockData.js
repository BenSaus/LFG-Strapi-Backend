createMockData = async (strapi) => {
  const businesses = await createBusinesses(strapi);
  await createRooms(strapi, businesses);

  const users = await createUsers(strapi);
  const groups = await createGroups(strapi, users);

  await createInvites(strapi, users, groups);
  await createApplications(strapi, users, groups);
  await createAchievements(strapi, users);
};

createUsers = async (strapi) => {
  let users = [];

  if ((await strapi.plugins["users-permissions"].services.user.count()) === 0) {
    users.push(
      await strapi.plugins["users-permissions"].services.user.add({
        username: "John",
        email: "goblin@gblah.com",
        provider: "local",
        password: "",
        confirmed: true,
        blocked: false,
        groups: null,
        age: 16,
        image: null,
        about: "About this user",
        open_to_invite: true,
        hide_age: false,
        approved: true,
        role: { id: 1 },
        groups: [],
        leading_groups: [],
      })
    );

    users.push(
      await strapi.plugins["users-permissions"].services.user.add({
        username: "Sally",
        email: "sally@gblah.com",
        provider: "local",
        password: "",
        confirmed: true,
        blocked: false,
        groups: null,
        age: 27,
        image: null,
        about: "About Sally",
        open_to_invite: true,
        hide_age: false,
        approved: true,
        role: { id: 1 },
        groups: [],
        leading_groups: [],
      })
    );

    users.push(
      await strapi.plugins["users-permissions"].services.user.add({
        username: "Ben",
        email: "ben@gblah.com",
        provider: "local",
        password: "",
        confirmed: true,
        blocked: false,
        groups: null,
        age: 12,
        image: null,
        about: "About Ben",
        open_to_invite: true,
        hide_age: false,
        approved: true,
        role: { id: 1 },
        groups: [],
        leading_groups: [],
      })
    );

    users.push(
      await strapi.plugins["users-permissions"].services.user.add({
        username: "Jordan",
        email: "jordan@gblah.com",
        provider: "local",
        password: "",
        confirmed: true,
        blocked: false,
        groups: null,
        age: 26,
        image: null,
        about: "About Sally",
        open_to_invite: true,
        hide_age: false,
        approved: true,
        role: { id: 1 },
        groups: [],
        leading_groups: [],
      })
    );
  }

  return users;
};

createGroups = async (strapi, users) => {
  let groups = [];

  if ((await strapi.query("group").count()) === 0) {
    console.log("Create groups...");

    groups.push(
      await strapi.services.group.create({
        name: "Strings",
        description: "Open group",
        open_slots: 3,
        booking_status: "notBooked",
        leader: users[0].id,
        applications: [],
        members: [users[0].id, users[1].id],
        invites: [],
        max_age: 30,
        min_age: 10,
      })
    );

    groups.push(
      await strapi.services.group.create({
        name: "Wombats",
        description: "Booked Group",
        open_slots: 2,
        booking_status: "booked",
        leader: users[3].id,
        applications: [],
        members: [users[1].id, users[3].id],
        invites: [],
        max_age: 40,
        min_age: 20,
      })
    );
  }

  return groups;
};

createInvites = async (strapi, users, groups) => {
  if ((await strapi.query("invite").count()) === 0) {
    console.log("Create invites");

    await strapi.services.invite.create({
      invitee: users[0].id, //     <-- User
      message: "Invite message",
      group: groups[0].id, //     <-- Group
    });
  }
};

createApplications = async (strapi, users, groups) => {
  if ((await strapi.query("application").count()) === 0) {
    console.log("Create apps...");

    await strapi.services.application.create({
      applicant: users[2].id,
      message: "Application message",
      group: groups[0].id,
    });
  }
};

createAchievements = async (strapi, users) => {
  if ((await strapi.query("achievement").count()) === 0) {
    console.log("Create Achievements...");
    await strapi.services.achievement.create({
      name: "Murdered",
      description: "Completed the Murder Room",
      users: [users[1].id],
    });
    await strapi.services.achievement.create({
      name: "Into Space!",
      description: "Completed the Space Room",
      users: [users[0].id],
    });
    await strapi.services.achievement.create({
      name: "Didn't Make It",
      description: "Failed the Murder Room, Bad",
      users: [users[2].id, users[3].id],
    });
  }
};

createRooms = async (strapi, businesses) => {
  if ((await strapi.query("room").count()) === 0) {
    console.log("Create rooms...");
    await strapi.services.room.create({
      name: "Space",
      description: "An amazing escape room",
      image: null,
      business: businesses[0].id,
    });
    await strapi.services.room.create({
      name: "Murder",
      description: "An amazing escape room",
      image: null,
      business: businesses[0].id,
    });
  }
};

createBusinesses = async (strapi) => {
  const businesses = [];

  if ((await strapi.query("business").count()) === 0) {
    console.log("Create Businesses...");
    businesses.push(
      await strapi.services.business.create({
        name: "Tilted Windmill",
        address: "829 Main Street",
        website_url: "",
        description: "",
        image: null,
        rooms: [],
      })
    );
  }

  return businesses;
};

module.exports = {
  createMockData,
};

// console.log(strapi.admin);

// console.log(await strapi.admin.services.user.findOne({ id: 1 }));

// if (strapi.admin.query("user").count() === 0) {
// Wrong plugin I need users and permissions
// const resp = await strapi.admin.services.user.create({
//   username: "ImaUser",
//   email: "goblin@gblah.com",
//   firstname: "Bill",
//   lastname: "Billy",
//   provider: "local",
//   password: "",
//   role: 0,
//   confirmed: true,
//   isActive: true,
//   blocked: false,
//   groups: null,
//   age: 16,
//   image: null,
//   about: "About this user",
//   open_to_invite: true,
//   hide_age: false,
//   approved: true,
// });
// console.log(resp);
// }
