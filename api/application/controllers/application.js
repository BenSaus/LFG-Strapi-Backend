"use strict";
const { parseMultipartData, sanitizeEntity } = require("strapi-utils");
/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  /**
   * Create application override
   *
   * @return {Object}
   */
  async create(ctx) {
    let entity;

    const userId = ctx.request.body.applicant;
    const groupId = ctx.request.body.group;

    const group = await strapi.services.group.findOne({ id: groupId });

    // Is this person a member of the group?
    for (const member of group.members) {
      console.log(member.id, userId);

      if (member.id === Number(userId)) {
        console.log("Already Member");
        return null; // TODO: A descriptive error should be returned here...
      }
    }

    // Is this application a duplicate?
    const application = await strapi.services.application.findOne({
      applicant: userId,
      group: groupId,
    });

    if (application) {
      console.log("Found dupe");
      return null; // TODO: A descriptive error should be returned here...
    }

    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.application.create(data, { files });
    } else {
      entity = await strapi.services.application.create(ctx.request.body);
    }
    return sanitizeEntity(entity, { model: strapi.models.application });
  },

  /**
   * Accept the application
   *
   * @return {Object}
   */
  async accept(ctx) {
    if (ctx.is("multipart")) {
    } else {
      const appId = ctx.request.body.id;
      const app = await strapi.services.application.findOne({ id: appId });

      if (app === null) {
        // TODO: Better to return an error message here
        return null;
      }
      const applicantId = app.applicant.id;

      const groupId = app.group.id;
      // TODO: Make sure the caller is the leader of this group here....
      const group = await strapi.services.group.findOne({ id: groupId });

      const currentMemberIds = group.members.map((member) => member.id);
      currentMemberIds.push(applicantId);

      const updatedApp = await strapi.services.application.update(
        { id: appId },
        {
          status: "accepted", // TODO: Change to constants
        }
      );

      const updatedGroup = await strapi.services.group.update(
        { id: groupId },
        {
          members: currentMemberIds,
        }
      );

      return {
        group: sanitizeEntity(updatedGroup, { model: strapi.models.group }),
        application: sanitizeEntity(updatedApp, {
          model: strapi.models.application,
        }),
      };
    }

    return null;
  },

  /**
   * The group leader has reject this application
   *
   * @return {Object}
   */
  async reject(ctx) {
    if (ctx.is("multipart")) {
    } else {
      const appId = ctx.request.body.id;
      const app = await strapi.services.application.findOne({ id: appId });

      if (app === null) {
        // TODO: Better to return an error message here
        return null;
      }

      const updatedApp = await strapi.services.application.update(
        { id: appId },
        {
          status: "rejected", // TODO: Change to constants
        }
      );

      return {
        application: sanitizeEntity(updatedApp, {
          model: strapi.models.application,
        }),
      };
    }

    return null;
  },
};
