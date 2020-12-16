"use strict";
const { parseMultipartData, sanitizeEntity } = require("strapi-utils");
/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    // async create(ctx) {
    //     let entity;
    //     if (ctx.is("multipart")) {
    //         const { data, files } = parseMultipartData(ctx);
    //         entity = await strapi.services.restaurant.create(data, { files });
    //     } else {
    //         entity = await strapi.services.restaurant.create(ctx.request.body);
    //     }
    //     return sanitizeEntity(entity, { model: strapi.models.restaurant });
    // },

    /**
     * Accept the invitation
     *
     * @return {Object}
     */
    async accept(ctx) {
        if (ctx.is("multipart")) {
        } else {
            const inviteId = ctx.request.body.id;

            const invite = await strapi.services.invite.findOne({
                id: inviteId,
            });

            if (invite !== null) {
                const inviteeId = invite.invitee.id;
                const groupId = invite.group.id;
                const group = await strapi.services.group.findOne({
                    id: groupId,
                });

                const currentMemberIds = group.members.map(
                    (member) => member.id
                );
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
                    group: sanitizeEntity(updatedGroup, {
                        model: strapi.models.group,
                    }),
                    invite: sanitizeEntity(updatedInvite, {
                        model: strapi.models.invite,
                    }),
                };
            }
        }

        return null;
    },

    async reject(ctx) {},

    async dismiss(ctx) {
        const inviteId = ctx.request.body.id;
        const requestingUserId = ctx.state.user.id;

        const invite = await strapi.services.invite.findOne({ id: inviteId });

        if (invite !== null) {
            const groupLeaderId = invite.group.leader;

            // Requestor must be group leader
            if (groupLeaderId === requestingUserId) {
                const updatedInvite = await strapi.services.invite.update(
                    { id: inviteId },
                    {
                        group_leader_dismissed: true,
                    }
                );

                return sanitizeEntity(updatedInvite, {
                    model: strapi.models.invite,
                });
            } else {
                const err = new Error("Not authorized");
                err.status = 403;
                throw err;
            }
        } else {
            const err = new Error("Invite not found");
            err.status = 404;
            throw err;
        }
    },
};
