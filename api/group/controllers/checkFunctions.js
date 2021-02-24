const errorCodes = require("../../errorCodes");

module.exports = {
    groupMustBeValid: (group) => {
        if (group === null) {
            const err = new Error(errorCodes.GROUP_NOT_FOUND.message);
            err.status = errorCodes.GROUP_NOT_FOUND.code;
            throw err;
        }
    },

    requestorMustBeGroupLeader: (group, requestingUserId) => {
        // WARNING: Assumes group.leader is an object
        if(group.leader.id !== requestingUserId) {
            const err = new Error(errorCodes.NOT_AUTHORIZED.message);
            err.status = errorCodes.NOT_AUTHORIZED.code;
            throw err;
        }
    },

    requestorMustNotBeAMemberOfGroup: (group, requestingUserId) => {
        // Requestor must not already be a member of the group
        const currentMemberIds = group.members.map((member) => member.id);

        // TOOD: Check if group.members exists?

        if (currentMemberIds.includes(requestingUserId)) {
            const err = new Error(errorCodes.ALREADY_A_MEMBER.message);
            err.status = errorCodes.ALREADY_A_MEMBER.code;
            throw err;
        }

    },

    userMustBeAGroupMember: (group, userId) => {
        if(group.members.map((user) => user.id).includes(userId) === false) {
            const err = new Error(errorCodes.MEMBER_NOT_FOUND.message);
            err.status = errorCodes.MEMBER_NOT_FOUND.code;
            throw err;
        }
    }
}