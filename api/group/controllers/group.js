"use strict";
const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

class GroupMaximumError extends Error {
  constructor(message) {
    super(message);
    this.name = "GroupMaximumError";
    this.code = "1000";
  }
}

// TODO: Move this into const file
const MAX_GROUP_NUMBER = 3;

module.exports = {
  //   async create(ctx) {
  //     let entity;
  //     console.log("Create group called!!! by " + ctx.state.user.id);
  //     const leadGroups = await strapi.services.group.find({
  //       leader: ctx.state.user.id,
  //     });
  //     const groupCount = leadGroups.length;
  //     console.log(groupCount);
  //     if (groupCount < MAX_GROUP_NUMBER) {
  //       entity = await strapi.services.group.create(ctx.request.body);
  //     } else {
  //       // TODO: A descriptive error should be returned here...
  //       throw new GroupMaximumError(
  //         "You have already created the maximum number of groups"
  //       );
  //     }
  //     return sanitizeEntity(entity, { model: strapi.models.group });
  //   },
};
