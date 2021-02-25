
const inviteChecks = require('./invite/controllers/checkFunctions')
const applicationChecks = require('./application/controllers/checkFunctions')
const groupChecks = require('./group/controllers/checkFunctions')


module.exports = {
    ...inviteChecks,
    ...applicationChecks,
    ...groupChecks,

    throwInternalServerError: (error) => {
        // TODO: research this...
        //      Add logging 

        // const err = new Error("Internal Server Error");
        // err.status = 500;
        throw error;
    }
}