const errorCodes = require("../../errorCodes");

module.exports = {

    applicationMustNotAlreadyExist: (application) => {
        if(application !== null) {
            const err = new Error(errorCodes.APPLICATION_ALREADY_EXISTS.message);
            err.status = errorCodes.APPLICATION_ALREADY_EXISTS.code;
            throw err;
        }
    },

    inviteMustNotExist: (invite) => {
        if(invite !== null) {
            const err = new Error(errorCodes.USER_ALREADY_INVITED_TO_GROUP.message);
            err.status = errorCodes.USER_ALREADY_INVITED_TO_GROUP.code;
            throw err;
        }
    }

}
