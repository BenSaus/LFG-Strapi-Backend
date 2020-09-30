"use strict";

// import createMockData from "./mockData";

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/v3.x/concepts/configurations.html#bootstrap
 */

module.exports = () => {
  console.log("Creating fake data...");

  createMockData(strapi);
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
