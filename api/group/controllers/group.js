"use strict";
const { sanitizeEntity } = require("strapi-utils");
const check = require("../../checkFunctions");

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async removeMember(ctx) {
        const { groupId } = ctx.request.body;
        const memberIdToRemove = Number(ctx.request.body.memberId);
        const requestingUserId = ctx.state.user.id;

        // VALIDATE IDs

        const group = await strapi.services.group.findOne({
            id: groupId,
        });

        check.groupMustBeValid(group);
        check.userMustBeGroupLeader(group, requestingUserId);
        check.userMustBeGroupMember(group, memberIdToRemove);

        try {
            const updatedMembers = group.members.filter(
                // WARNING: Here I am assuming Id's are Numbers!!!
                (member) => member.id !== memberIdToRemove
            );

            const updatedGroup = {
                members: updatedMembers,
            };
            const entity = await strapi.services.group.update(
                { id: groupId },
                updatedGroup
            );

            const sanitizedGroup = sanitizeEntity(entity, {
                model: strapi.models.group,
            });

            return { group: sanitizedGroup };
        } catch (error) {
            check.throwInternalServerError(error);
        }
    },

    async leaveGroup(ctx) {
        const groupId = ctx.request.body.id;
        const requestingUserId = ctx.state.user.id;

        // VALIDATE ID

        // Verify this request is from a member of the group
        const group = await strapi.services.group.findOne({
            id: groupId,
        });

        check.groupMustBeValid(group);
        check.userMustBeGroupMember(group, requestingUserId);

        try {
            const updatedMembers = group.members.filter(
                (member) => member.id !== requestingUserId
            );

            const updatedGroup = { members: updatedMembers };

            const entity = await strapi.services.group.update(
                { id: groupId },
                updatedGroup
            );

            const sanitizedGroup = sanitizeEntity(entity, {
                model: strapi.models.group,
            });

            return { group: sanitizedGroup };
        } catch (error) {
            check.throwInternalServerError(error);
        }
    },

    // async createGroup(ctx) {}
    // async updateGroup(ctx) {
    //      leader only
    // }
    // async deleteGroup(ctx) {}
};
