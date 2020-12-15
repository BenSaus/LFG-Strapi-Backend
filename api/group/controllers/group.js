"use strict";
const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async removeMember(ctx) {
        // Inputs: group id, user id to remove,

        console.log(ctx.params);

        const { id: groupId, userId: userIdToRemove } = ctx.params;

        // Verify this request is from the leader of the group
        const group = await strapi.services.group.findOne({
            id: groupId,
        });

        console.log(group);

        if (group !== null) {
            const leaderId = group.leader.id;
            const requestingUserId = ctx.state.user.id;

            if (requestingUserId === leaderId) {
                const updatedMembers = group.members.filter(
                    // WARNING: Here I am assuming Id's are Numbers!!!
                    (member) => member.id !== Number(userIdToRemove)
                );

                const updatedGroup = {
                    members: updatedMembers,
                };

                const entity = await strapi.services.group.update(
                    { id: groupId },
                    updatedGroup
                );

                return sanitizeEntity(entity, {
                    model: strapi.models.group,
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

    async memberLeave(ctx) {
        const { id: groupId } = ctx.params;

        // Verify this request is from a member of the group
        const group = await strapi.services.group.findOne({
            id: groupId,
        });

        if (group) {
            const memberIds = group.members.map((member) => member.id);
            const requestingUserId = ctx.state.user.id;

            console.log("requestingUserId", requestingUserId);

            console.log(
                "Filter members",
                memberIds,
                memberIds.includes(requestingUserId)
            );
            if (memberIds.includes(requestingUserId)) {
                const updatedMembers = group.members.filter(
                    (member) => member.id !== requestingUserId
                );

                const updatedGroup = { members: updatedMembers };

                console.log("updatedMembers", updatedMembers);

                const entity = await strapi.services.group.update(
                    { id: groupId },
                    updatedGroup
                );

                return sanitizeEntity(entity, {
                    model: strapi.models.group,
                });
            } else {
                const err = new Error("Member not found");
                err.status = 404;
                throw err;
            }
        } else {
            const err = new Error("Group not found");
            err.status = 404;
            throw err;
        }
    },
};
