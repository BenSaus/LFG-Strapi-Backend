"use strict";
const { parseMultipartData, sanitizeEntity } = require("strapi-utils");
const errorCodes = require("../../errorCodes");
const check = require("../../checkFunctions");

const APPLICATION_STATUS_UNDECIDED = "undecided";

module.exports = {
    /**
     * Create application override
     *
     * @return {Object}
     */

    async create(ctx) {
        const message = ctx.request.body.message;
        const groupId = ctx.request.body.group;
        const requestingUserId = ctx.state.user.id;

        // TODO: VALIDATE HERE...

        // Group must exist and be open
        const group = await strapi.services.group.findOne({ id: groupId });

        check.groupMustBeValid(group);
        check.groupMustBeOpen(group);

        // Cannot apply to your own group
        check.userMustNotBeGroupLeader(group, requestingUserId);
        // Applicant cannot already be a member
        check.userMustNotBeGroupMember(group, requestingUserId);

        // Check for duplicate applications
        const application = await strapi.services.application.findOne({
            applicant: requestingUserId,
            group: groupId,
        });
        check.applicationMustNotAlreadyExist(application);

        // Check that a corresponding invite does not exist
        const invite = await strapi.services.invite.findOne({
            invitee: requestingUserId,
            group: groupId,
        });
        check.inviteMustNotExist(invite);

        try {
            const newApplication = await strapi.services.application.create({
                applicant: requestingUserId,
                group: groupId,
                message,
                status: APPLICATION_STATUS_UNDECIDED,
            });
            return sanitizeEntity(newApplication, {
                model: strapi.models.application,
            });
        } catch (error) {
            check.throwInternalServerError(error);
        }
    },

    async accept(ctx) {
        const applicationId = ctx.request.body.id;
        const requestingUserId = ctx.state.user.id;

        // TOOD: VALIDATE HERE...

        // Application must exist
        const application = await strapi.services.application.findOne({
            id: applicationId,
        });
        check.applicationMustBeValid(application);

        // Group must exist
        const group = await strapi.services.group.findOne({
            id: application.group.id,
        });
        check.groupMustBeValid(group);

        // Only leaders can accept applications
        check.userMustBeGroupLeader(group, requestingUserId);
        
        // The applicant should not already be a member
        // TODO: WARNING: If the user is a group member this could be an error state
        check.userMustNotBeGroupMember(group, application.applicant.id);        

        try {
            // Update the application
            const updatedApp = await strapi.services.application.update(
                { id: applicationId },
                {
                    status: "accepted", // TODO: Change to constants
                }
            );

            // Add the applicant to the group member list
            const applicantId = application.applicant.id;
            const currentMemberIds = group.members.map((member) => member.id);
            currentMemberIds.push(applicantId);
            await strapi.services.group.update(
                { id: group.id },
                {
                    members: currentMemberIds,
                }
            );

            return {
                application: sanitizeEntity(updatedApp, {
                    model: strapi.models.application,
                }),
            };
        } catch (error) {
            check.throwInternalServerError(error);
        }
    },

    async reject(ctx) {
        const applicationId = ctx.request.body.id;
        const requestingUserId = ctx.state.user.id;

        // TOOD: VALIDATE HERE...

        // Application must exist
        const application = await strapi.services.application.findOne({
            id: applicationId,
        });
        check.applicationMustBeValid(application);

        const group = await strapi.services.group.findOne({
            id: application.group.id,
        });
        check.groupMustBeValid(group);

        // Requestor must be the group leader
        check.userMustBeGroupLeader(group, requestingUserId);

        try {
            const updatedApp = await strapi.services.application.update(
                { id: applicationId },
                {
                    status: "rejected", // TODO: Change to constants
                }
            );

            return {
                application: sanitizeEntity(updatedApp, {
                    model: strapi.models.application,
                }),
            };
        } catch (error) {
            check.throwInternalServerError(error);
        }
    },

};
