const errorCodes = require("../../errorCodes");

module.exports = {


    applicationMustBeValid: (application) => {
        if(application === null) {
            const err = new Error(errorCodes.APPLICATION_NOT_FOUND.message);
            err.status = errorCodes.APPLICATION_NOT_FOUND.code;
            throw err;
        }
    },

    applicationMustNotAlreadyExist: (application) => {
        if(application !== null) {
            const err = new Error(errorCodes.APPLICATION_ALREADY_EXISTS.message);
            err.status = errorCodes.APPLICATION_ALREADY_EXISTS.code;
            throw err;
        }
    },

    inviteMustNotExist: (invite) => {
        if(invite !== null) {
            const err = new Error(errorCodes.USER_ALREADY_INVITED.message);
            err.status = errorCodes.USER_ALREADY_INVITED.code;
            throw err;
        }
    }

}
