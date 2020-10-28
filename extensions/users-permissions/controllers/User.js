"use strict";
const { sanitizeEntity } = require("strapi-utils");

module.exports = {
  //   async me(ctx) {
  //     console.log("ME Fired!!!");

  //     const user = ctx.state.user;

  //     if (!user) {
  //       return ctx.badRequest(null, [
  //         { messages: [{ id: "No authorization header was found" }] },
  //       ]);
  //     }

  //     ctx.body = sanitizeEntity(user, {
  //       model: strapi.query("user", "users-permissions").model,
  //     });
  //   },

  async meExtra(ctx) {
    console.log("Extra Fired!!!");

    const user = ctx.state.user;

    if (!user) {
      return ctx.badRequest(null, [
        { messages: [{ id: "No authorization header was found" }] },
      ]);
    }

    const id = user.id;

    const data = await strapi
      .query("user", "users-permissions")
      .findOne({ id }, ["role", "achievements", "image"]);

    ctx.body = sanitizeEntity(data, {
      model: strapi.query("user", "users-permissions").model,
    });
  },
};

// https://app.slack.com/client/T0BLB2VFV/C0BLB2VJ7/thread/C0BNGCDNH-1600968615.072800
// https://github.com/strapi/strapi/blob/4a27d9d46bf52fbb8d5406de4d73aa920db8c9aa/packages/strapi-plugin-users-permissions/controllers/User.js

// routes
// {
//   "method": "GET",
//   "path": "/users/me",
//   "handler": "User.me",
//   "config": {
//     "policies": []
//   }
// },

// {
//     "routes": [
//       {
//         "method": "GET",
//         "path": "/users/meExtra",
//         "handler": "User.meExtra",
//         "config": {
//           "policies": []
//         }
//       }
//     ]
//   }
