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

            // Only intended for test case creation
            // if(resp.body.errors) {
            //     for(let error of resp.body.errors) {
            //         console.log(`🛑 ~ file: LFGActions.js ~ line 26 ~ resp.body.errors`, error, error.extensions?.exception?.data)
            //     }
            // }

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

        this.leaderCloseGroup = async function (leaderUser, groupId) {
            const variables = { id: groupId, status: "closed" };
            const resp = await utils.call(
                leaderUser.jwt,
                graphql.mutations.updateGroup,
                variables
            );

            return {
                response: resp,
                errors: resp.body.errors,
                group: resp.body?.data?.updateGroup?.group,
            };
        };

        this.leaderOpenGroup = async function (leaderUser, groupId) {
            const variables = { id: groupId, status: "open" };
            const resp = await utils.call(
                leaderUser.jwt,
                graphql.mutations.updateGroup,
                variables
            );

            return {
                response: resp,
                errors: resp.body.errors,
                group: resp.body?.data?.updateGroup?.group,
            };
        };

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
            };
        };

        this.leaderCreateInvite = async function (
            leaderUser,
            groupId,
            inviteeId,
            message = ""
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
        this.userCreateApplication = async function (
            user,
            groupId,
            message = ""
        ) {
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
        ) {
            const variables = {
                id: applicationId,
            };
            const resp = await utils.call(
                leaderUser.jwt,
                graphql.mutations.acceptApplication,
                variables
            );

            return {
                response: resp,
                errors: resp.body.errors,
                application: resp.body?.data?.acceptApplication?.application,
            };
        };

        this.leaderRejectApplication = async function (
            applicationId,
            leaderUser
        ) {
            const variables = {
                id: applicationId,
            };
            const resp = await utils.call(
                leaderUser.jwt,
                graphql.mutations.rejectApplication,
                variables
            );

            return {
                response: resp,
                errors: resp.body.errors,
                application: resp.body?.data?.rejectApplication?.application,
            };
        };
    }
}

module.exports = LFGActions;
