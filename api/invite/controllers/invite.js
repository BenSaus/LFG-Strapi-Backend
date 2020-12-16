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
        const inviteId = ctx.request.body.id;
        const requestingUserId = ctx.state.user.id;

        const invite = await strapi.services.invite.findOne({
            id: inviteId,
        });

        if (invite !== null) {
            const inviteeId = invite.invitee.id;
            const groupId = invite.group.id;

            if (inviteeId === Number(requestingUserId)) {
                const group = await strapi.services.group.findOne({
                    id: groupId,
                });

                // Requestor must not already be a member of the group
                if (
                    group.members.map((member) => member.id).includes(inviteeId)
                ) {
                    const err = new Error("Already a member");
                    err.status = 400;
                    throw err;
                }

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

    async reject(ctx) {
        const inviteId = ctx.request.body.id;
        const requestingUserId = ctx.state.user.id;

        const invite = await strapi.services.invite.findOne({ id: inviteId });

        if (invite !== null) {
            const inviteeId = invite.invitee.id;

            // Requestor must be the invitee of this invite
            if (inviteeId === requestingUserId) {
                const updatedInvite = await strapi.services.invite.update(
                    { id: inviteId },
                    {
                        status: "rejected",
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
