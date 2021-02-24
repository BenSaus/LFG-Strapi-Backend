
const inviteChecks = require('./invite/controllers/checkFunctions')
const groupChecks = require('./group/controllers/checkFunctions')


module.exports = {
    ...inviteChecks,
    ...groupChecks,
}