const request = require("supertest");
const graphql = require("./graphql");

// REMEMBER: NO LOGIC IS ALLOWED HERE

class LFGActions {
    constructor(strapi) {
        this.strapi = strapi;

        this._call = function (jwt, query, variables) {
            return request(this.strapi.server)
                .post("/graphql")
                .send({
                    query,
                    variables,
                })
                .set("Authorization", "Bearer " + jwt)
                .set("Content-Type", "application/json")
                .set("accept", "application/json");
        };

        this.userCreateGroup = async function (groupData, leaderUser, name) {
            // Group names must be unique, so we overwrite the group name here
            const modGroupData = { ...groupData };
            modGroupData.name = name;

            // WARNING: TODO: Passing leader information in variables is temporary until the create group endpoint is updated
            const variables = { ...modGroupData, leader: leaderUser.id };
            const resp = await this._call(
                leaderUser.jwt,
                graphql.mutations.createGroup,
                variables
            );

            return { resp: resp, group: resp.body?.data?.createGroup?.group };
        };

        this.userCreateApplication = async function (user, groupId) {
            const variables = {
                group: groupId,
                applicant: user.id,
                message: "BLANK",
            };
            const resp = await this._call(
                user.jwt,
                graphql.mutations.createApplication,
                variables
            );

            return {
                resp,
                application: resp.body?.data?.createApplication?.application,
            };
        };

        this.userAcceptInvite = async function (user, inviteId) {
            const variables = { id: inviteId };
            const resp = await this._call(
                user.jwt,
                graphql.mutations.acceptInvite,
                variables
            );

            return {
                resp,
                invite: resp.body?.data?.acceptInvite?.invite,
                group: resp.body?.data?.acceptInvite?.group,
            };
        };

        this.memberPostChatMessage = async function (userId, groupId) {};

        this.memberLeaveGroup = async function (user, groupId) {
            const variables = { id: groupId };
            const resp = await this._call(
                user.jwt,
                graphql.mutations.leaveGroup,
                variables
            );

            return { resp, group: resp.body?.data?.leaveGroup?.group };
        };

        this.leaderRemoveMember = async function (
            leaderUser,
            groupId,
            userIdToRemove
        ) {
            const variables = { groupId, memberId: userIdToRemove };
            const resp = await this._call(
                leaderUser.jwt,
                graphql.mutations.removeMember,
                variables
            );

            return { resp, group: resp.body?.data?.removeMember?.group };
        };
        this.leaderDeleteGroup = async function (leaderUser, groupId) {};
        this.leaderAddSlot = async function (leaderUser, groupId) {};
        this.leaderRemoveSlot = async function (leaderUser, groupId) {};
        this.leaderCreateInvite = async function (
            leaderUser,
            groupId,
            inviteeId
        ) {
            const variables = {
                invitee: inviteeId,
                group: groupId,
                message: "BLANK",
            };
            const resp = await this._call(
                leaderUser.jwt,
                graphql.mutations.createInvite,
                variables
            );

            return { resp, invite: resp.body.data.createInvite.invite };
        };
        this.leaderDismissInvite = async function (
            leaderUser,
            groupId,
            inviteId
        ) {};
        this.leaderAcceptApplication = async function (
            applicationId,
            leaderUser
        ) {};
        this.leaderRejectApplication = async function (
            applicationId,
            leaderUser
        ) {};
    }
}

module.exports = LFGActions;
