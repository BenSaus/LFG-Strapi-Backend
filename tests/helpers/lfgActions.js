const request = require("supertest");
const graphql = require("./graphql");

// REMEMBER: NO LOGIC IS ALLOWED HERE

function LFGActions(strapi) {

    this.strapi = strapi

    this._call = function(jwt, query, variables) {
        return request(this.strapi.server)
            .post("/graphql")
            .send({
                query,
                variables,
            })
            .set("Authorization", "Bearer " + jwt)
            .set("Content-Type", "application/json")
            .set("accept", "application/json")
    }

    this.userCreateGroup = async function (groupData, leaderUser, name) {
        // Group names must be unique, so we overwrite the group name here
        const modGroupData = {...groupData}
        modGroupData.name = name
        
        // WARNING: TODO: Passing leader information here is temporary until the create group endpoint is updated
        const variables = { ...modGroupData, leader: leaderUser.id };    
        const resp = await this._call(leaderUser.jwt, graphql.mutations.createGroup, variables)

        return resp.body.data.createGroup.group;
    }
    
    this.userCreateApplication = async function (user, groupId) {}
    this.userAcceptInvite = async function (user, inviteId) {}
    
    this.memberPostChatMessage = async function (userId, groupId) {}
    this.memberLeaveGroup = async function (user, groupId) {}
    
    this.leaderRemoveMember = async function (leaderUser, groupId, userToRemove) {}
    this.leaderDeleteGroup = async function (leaderUser, groupId) {}
    this.leaderAddSlot = async function (leaderUser, groupId) {}
    this.leaderRemoveSlot = async function (leaderUser, groupId) {}
    this.leaderCreateInvite = async function (leaderUser, groupId, inviteeId) {}
    this.leaderDismissInvite = async function (leaderUser, groupId, inviteId) {}
    this.leaderAcceptApplication = async function (applicationId, leaderUser) {}
    this.leaderRejectApplication = async function (applicationId, leaderUser) {}
}



module.exports = LFGActions;
