
const inviteErrorCodes = require('./invite/controllers/errorCodes')
const groupErrorCodes = require('./group/controllers/errorCodes')


module.exports = {
    ...inviteErrorCodes,
    ...groupErrorCodes,

    // General error codes
    NOT_AUTHORIZED: 403
}