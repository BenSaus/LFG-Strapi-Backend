
const inviteChecks = require('./invite/controllers/checkFunctions')
const groupChecks = require('./group/controllers/checkFunctions')


module.exports = {
    ...inviteChecks,
    ...groupChecks,

    throwInternalServerError: (error) => {
        // TODO: research this...

        // const err = new Error("Internal Server Error");
        // err.status = 500;
        throw error;
    }
}