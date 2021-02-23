"use strict";
const { parseMultipartData, sanitizeEntity } = require("strapi-utils");
const { createGroupData } = require("../../../tests/group/mockData");

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async removeMember(ctx) {
        const { groupId, memberId: memberIdToRemove } = ctx.request.body;

        // VALIDATE IDs

        // Verify this request is from the leader of the group
        const group = await strapi.services.group.findOne({
            id: groupId,
        });

        if (group !== null) {
            const leaderId = group.leader.id;
            const requestingUserId = ctx.state.user.id;

            if (requestingUserId === leaderId) {
                const updatedMembers = group.members.filter(
                    // WARNING: Here I am assuming Id's are Numbers!!!
                    (member) => member.id !== Number(memberIdToRemove)
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

    async leaveGroup(ctx) {
        const groupId = ctx.request.body.id;

        // VALIDATE ID

        // Verify this request is from a member of the group
        const group = await strapi.services.group.findOne({
            id: groupId,
        });

        if (group) {
            const memberIds = group.members.map((member) => member.id);
            const requestingUserId = ctx.state.user.id;

            if (memberIds.includes(requestingUserId)) {
                const updatedMembers = group.members.filter(
                    (member) => member.id !== requestingUserId
                );

                const updatedGroup = { members: updatedMembers };

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

    
    // async createGroup(ctx) {}
    // async updateGroup(ctx) {
    //      leader only
    // }
    // async deleteGroup(ctx) {}

};
