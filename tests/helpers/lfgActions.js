const request = require("supertest");
const graphql = require("./graphql");
const utils = require("./utils");

// REMEMBER: NO LOGIC IS ALLOWED HERE

class LFGActions {
    constructor(strapi) {
        this.strapi = strapi;

        // Group Functions /////////////////
        this.userCreateGroup = async function (groupData, leaderUser, name) {
            // Group names must be unique, so we overwrite the group name here
            const modGroupData = { ...groupData };
            modGroupData.name = name;

            // WARNING: TODO: Passing leader information in variables is temporary until the create group endpoint is updated
            const variables = { ...modGroupData, leader: leaderUser.id };
            const resp = await utils.call(
                leaderUser.jwt,
                graphql.mutations.createGroup,
                variables
            );

            return {
                response: resp,
                errors: resp.body.errors,
                group: resp.body?.data?.createGroup?.group,
            };
        };
        this.leaderDeleteGroup = async function (leaderUser, groupId) {};
        this.memberLeaveGroup = async function (user, groupId) {
            const variables = { id: groupId };
            const resp = await utils.call(
                user.jwt,
                graphql.mutations.leaveGroup,
                variables
            );

            return {
                response: resp,
                errors: resp.body.errors,
                group: resp.body?.data?.leaveGroup?.group,
            };
        };

        this.leaderRemoveMember = async function (
            leaderUser,
            groupId,
            userIdToRemove
        ) {
            const variables = { groupId, memberId: userIdToRemove };
            const resp = await utils.call(
                leaderUser.jwt,
                graphql.mutations.removeMember,
                variables
            );

            return {
                response: resp,
                errors: resp.body.errors,
                group: resp.body?.data?.removeMember?.group,
            };
        };
        this.leaderAddSlot = async function (leaderUser, groupId) {};
        this.leaderRemoveSlot = async function (leaderUser, groupId) {};
        this.memberPostChatMessage = async function (userId, groupId) {};

        // Invite Functions /////////////////
        this.userAcceptInvite = async function (user, inviteId) {
            const variables = { id: inviteId };
            const resp = await utils.call(
                user.jwt,
                graphql.mutations.acceptInvite,
                variables
            );

            return {
                response: resp,
                errors: resp.body.errors,
                invite: resp.body?.data?.acceptInvite?.invite,
                group: resp.body?.data?.acceptInvite?.group,
            };
        };
        this.userRejectInvite = async function (user, inviteId) {
            const variables = { id: inviteId };
            const resp = await utils.call(
                user.jwt,
                graphql.mutations.rejectInvite,
                variables
            );

            return {
                response: resp,
                errors: resp.body.errors,
                invite: resp.body?.data?.rejectInvite?.invite,
                group: resp.body?.data?.rejectInvite?.group,
            };
        };
        this.leaderCreateInvite = async function (
            leaderUser,
            groupId,
            inviteeId,
            message=""
        ) {
            const variables = {
                invitee: inviteeId,
                group: groupId,
                message,
            };
            const resp = await utils.call(
                leaderUser.jwt,
                graphql.mutations.createInvite,
                variables
            );

            return {
                response: resp,
                errors: resp.body.errors,
                invite: resp.body?.data?.createInvite?.invite,
            };
        };
        this.leaderDismissInvite = async function (
            leaderUser,
            groupId,
            inviteId
        ) {};

        // Application Functions /////////////////
        this.userCreateApplication = async function (user, groupId, message="") {
            const variables = {
                group: groupId,
                applicant: user.id,
                message,
            };
            const resp = await utils.call(
                user.jwt,
                graphql.mutations.createApplication,
                variables
            );

            return {
                response: resp,
                errors: resp.body.errors,
                application: resp.body?.data?.createApplication?.application,
            };
        };
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
