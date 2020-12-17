"use strict";
const { parseMultipartData, sanitizeEntity } = require("strapi-utils");
/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async create(ctx) {
        console.log(ctx.request.body);

        const inviteeId = ctx.request.body.invitee;
        const groupId = ctx.request.body.group;
        const message = ctx.request.body.message;
        const requestingUserId = ctx.state.user.id;

        console.log(inviteeId, groupId, message, requestingUserId);

        // TOOD: VALIDATE HERE...
        // TOOD: ensure invitee exists

        const group = await strapi.services.group.findOne({
            id: groupId,
        });

        if (group !== null) {
            // Requestor must be group leader
            if (requestingUserId === group.leader.id) {
                const newInvite = await strapi.services.invite.create({
                    invitee: inviteeId,
                    group: groupId,
                    message,
                    group_leader_dismissed: false,
                    status: "undecided",
                });

                console.log(newInvite);

                return sanitizeEntity(newInvite, {
                    model: strapi.models.invite,
                });
            } else {
                const err = new Error("Not authorized");
                err.status = 403;
                throw err;
            }
        } else {
            const err = new Error("Group not found");
            err.status = 404;
            throw err;
        }
    },

    /**
     * Accept the invitation
     *
     * @return {Object}
     */
    async accept(ctx) {
        const inviteId = ctx.request.body.id;
        const requestingUserId = ctx.state.user.id;

        // TODO: VALIDATE HERE...

        const invite = await strapi.services.invite.findOne({
            id: inviteId,
        });

        if (invite !== null) {
            const inviteeId = invite.invitee.id;
            const groupId = invite.group.id;

            // Requestor must be the invitee
            if (Number(requestingUserId) === inviteeId) {
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

        // TODO: VALIDATE HERE...

        const invite = await strapi.services.invite.findOne({ id: inviteId });

        if (invite !== null) {
            const inviteeId = invite.invitee.id;

            // Requestor must be the invitee of this invite
            if (requestingUserId === inviteeId) {
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

        // TODO: VALIDATE HERE...

        const invite = await strapi.services.invite.findOne({ id: inviteId });

        if (invite !== null) {
            const groupLeaderId = invite.group.leader;

            // Requestor must be group leader
            if (requestingUserId === groupLeaderId) {
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
