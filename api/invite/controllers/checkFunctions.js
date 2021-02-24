const errorCodes = require("../../errorCodes");

const INVITE_STATUS_UNDECIDED = "undecided";
const INVITE_STATUS_REJECTED = "rejected";

module.exports = {
    inviteMustBeValid: (invite) => {
        if (invite === null) {
            const err = new Error(errorCodes.INVITE_NOT_FOUND.message);
            err.status = errorCodes.INVITE_NOT_FOUND.code;
            throw err;
        }
    },

    inviteMustNotBeDecided: (invite) => {
        // Invite must not have already been accepted or rejected
        if (invite.status !== INVITE_STATUS_UNDECIDED) {
            const err = new Error(errorCodes.INVITE_ALREADY_DECIDED.message);
            err.status = errorCodes.INVITE_ALREADY_DECIDED.code;
            throw err;
        }
    },

    requestorMustBeInvitee: (invite, requestingUserId) => {
        // Requestor must be the invitee of this invite
        if (requestingUserId !== invite.invitee.id) {
            const err = new Error(errorCodes.NOT_AUTHORIZED.message);
            err.status = errorCodes.NOT_AUTHORIZED.code;
            throw err;
        }
    },

    requestorMustBeInviteGroupLeader: (invite, requestingUserId) => {
        // WARNING: Assumes invite.group.leader is an ID
        if(invite.group.leader !== requestingUserId) {
            const err = new Error(errorCodes.NOT_AUTHORIZED.message);
            err.status = errorCodes.NOT_AUTHORIZED.code;
            throw err;
        }
    },

};
