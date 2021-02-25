
const inviteErrorCodes = require('./invite/controllers/errorCodes')
const applicationErrorCodes = require('./application/controllers/errorCodes')
const groupErrorCodes = require('./group/controllers/errorCodes')


module.exports = {
    ...inviteErrorCodes,
    ...applicationErrorCodes,
    ...groupErrorCodes,

    // General error codes
    NOT_AUTHORIZED: {code: 403, message: "Not authorized"},
    INTERNAL_SERVER_ERROR: {code: 500, message: "Internal server error"}
}