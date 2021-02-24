
const inviteErrorCodes = require('./invite/controllers/errorCodes')
const groupErrorCodes = require('./group/controllers/errorCodes')


module.exports = {
    ...inviteErrorCodes,
    ...groupErrorCodes,

    // General error codes
    NOT_AUTHORIZED: {code: 403, message: "Not authorized"},
    INTERNAL_SERVER_ERROR: {code: 500, message: "Internal server error"}
}