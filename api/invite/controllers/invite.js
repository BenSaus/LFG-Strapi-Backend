"use strict";
const { parseMultipartData, sanitizeEntity } = require("strapi-utils");
/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  /**
   * Accept the invitation
   *
   * @return {Object}
   */
  async accept(ctx) {
    if (ctx.is("multipart")) {
    } else {
      const inviteId = ctx.request.body.id;

      const invite = await strapi.services.invite.findOne({ id: inviteId });
      const inviteeId = invite.invitee.id;

      if (invite !== null) {
        const groupId = invite.group.id;
        const group = await strapi.services.group.findOne({ id: groupId });

        const currentMemberIds = group.members.map((member) => member.id);
        currentMemberIds.push(inviteeId);

        const updatedInvite = await strapi.services.invite.update(
          { id: inviteId },
          {
            status: "accepted",
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
          invite: sanitizeEntity(updatedInvite, {
            model: strapi.models.invite,
          }),
        };
      }
    }

    return null;
  },
};
