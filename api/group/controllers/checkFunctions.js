const errorCodes = require("../../errorCodes");

const GROUP_STATUS_OPEN = "open";

module.exports = {
    groupMustBeValid: (group) => {
        if (group === null) {
            const err = new Error(errorCodes.GROUP_NOT_FOUND.message);
            err.status = errorCodes.GROUP_NOT_FOUND.code;
            throw err;
        }
    },

    groupMustBeOpen: (group) => {
        if (group.status !== GROUP_STATUS_OPEN) {
            const err = new Error(errorCodes.GROUP_NOT_OPEN.message);
            err.status = errorCodes.GROUP_NOT_OPEN.code;
            throw err;
        }
    },

    userMustBeGroupLeader: (group, userId) => {
        // WARNING: Assumes group.leader is an object
        if (group.leader.id !== userId) {
            const err = new Error(errorCodes.NOT_AUTHORIZED.message);
            err.status = errorCodes.NOT_AUTHORIZED.code;
            throw err;
        }
    },

    userMustNotBeGroupLeader: (group, userId) => {
        // WARNING: Assumes group.leader is an object
        if (group.leader.id === userId) {
            const err = new Error(errorCodes.NOT_AUTHORIZED.message);
            err.status = errorCodes.NOT_AUTHORIZED.code;
            throw err;
        }
    },

    // TODO: May need to move this out of group, other methods throw not authorized errors
    userMustNotBeGroupMember: (group, userId) => {
        // Requestor must not already be a member of the group
        const currentMemberIds = group.members.map((member) => member.id);

        // TOOD: Check if group.members exists?

        if (currentMemberIds.includes(userId)) {
            const err = new Error(errorCodes.ALREADY_A_MEMBER.message);
            err.status = errorCodes.ALREADY_A_MEMBER.code;
            throw err;
        }
    },

    // TODO: May need to move this out of group, other methods throw not authorized errors
    userMustBeGroupMember: (group, userId) => {
        if (group.members.map((user) => user.id).includes(userId) === false) {
            const err = new Error(errorCodes.MEMBER_NOT_FOUND.message);
            err.status = errorCodes.MEMBER_NOT_FOUND.code;
            throw err;
        }
    },
};
