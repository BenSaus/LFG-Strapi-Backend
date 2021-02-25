"use strict";
const { parseMultipartData, sanitizeEntity } = require("strapi-utils");
const check = require("../../checkFunctions");
const errorCodes = require("../../errorCodes");
/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const INVITE_STATUS_UNDECIDED = "undecided";
const INVITE_STATUS_REJECTED = "rejected";

module.exports = {
    async create(ctx) {
        const inviteeId = ctx.request.body.invitee;
        const groupId = ctx.request.body.group;
        const message = ctx.request.body.message;
        const requestingUserId = ctx.state.user.id;

        // TOOD: VALIDATE HERE...

        const group = await strapi.services.group.findOne({
            id: groupId,
        });

        check.groupMustBeValid(group);
        check.requestorMustBeGroupLeader(group, requestingUserId);

        // TODO: Check that a corresponding application does not exist!!!!!

        try {
            const newInvite = await strapi.services.invite.create({
                invitee: inviteeId,
                group: groupId,
                message,
                group_leader_dismissed: false,
                status: INVITE_STATUS_UNDECIDED,
            });

            return sanitizeEntity(newInvite, {
                model: strapi.models.invite,
            });
        } catch (error) {
            check.throwInternalServerError(error);
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

        // TODO: VALIDATE IDS HERE...

        const invite = await strapi.services.invite.findOne({
            id: inviteId,
        });

        check.inviteMustBeValid(invite);
        check.requestorMustBeInvitee(invite, requestingUserId);
        check.inviteMustNotBeDecided(invite);

        const groupId = invite.group.id;
        const group = await strapi.services.group.findOne({
            id: groupId,
        });

        check.groupMustBeValid(group);
        check.requestorMustNotBeAMemberOfGroup(group, invite.invitee.id);

        try {
            // Update Invite
            const updatedInvite = await strapi.services.invite.update(
                { id: inviteId },
                {
                    status: "accepted",
                }
            );

            // Update Group
            const updatedMemberIds = group.members.map((member) => member.id);
            updatedMemberIds.push(invite.invitee.id);
            const updatedGroup = await strapi.services.group.update(
                { id: groupId },
                {
                    members: updatedMemberIds,
                }
            );

            return {
                invite: sanitizeEntity(updatedInvite, {
                    model: strapi.models.invite,
                }),
            };
        } catch (error) {
            check.throwInternalServerError(error);
        }
    },

    async reject(ctx) {
        const inviteId = ctx.request.body.id;
        const requestingUserId = ctx.state.user.id;

        // TODO: VALIDATE HERE...

        const invite = await strapi.services.invite.findOne({ id: inviteId });

        check.inviteMustBeValid(invite);
        check.requestorMustBeInvitee(invite, requestingUserId);
        check.inviteMustNotBeDecided(invite);

        try {
            const updatedInvite = await strapi.services.invite.update(
                { id: inviteId },
                {
                    status: INVITE_STATUS_REJECTED,
                }
            );

            const sanitizedInvite = sanitizeEntity(updatedInvite, {
                model: strapi.models.invite,
            });

            return { invite: sanitizedInvite };
        } catch (error) {
            check.throwInternalServerError(error);
        }
    },

    async dismiss(ctx) {
        const inviteId = ctx.request.body.id;
        const requestingUserId = ctx.state.user.id;

        // TODO: VALIDATE HERE...

        const invite = await strapi.services.invite.findOne({ id: inviteId });

        check.inviteMustBeValid(invite);
        check.requestorMustBeInviteGroupLeader(invite, requestingUserId);

        try {
            const updatedInvite = await strapi.services.invite.update(
                { id: inviteId },
                {
                    group_leader_dismissed: true,
                }
            );

            const sanitizedInvite = sanitizeEntity(updatedInvite, {
                model: strapi.models.invite,
            });

            return { invite: sanitizedInvite };
        } catch (error) {
            check.throwInternalServerError(error);
        }
    },
};
