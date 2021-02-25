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

        if (application !== null) {
            const group = await strapi.services.group.findOne({
                id: application.group.id,
            });

            if (group !== null) {
                // Requestor must be the group leader
                if (requestingUserId === group.leader.id) {
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
                } else {
                    const err = new Error("Not authorized");
                    err.status = 403;
                    throw err;
                }
            } else {
                const err = new Error("Group not found");
                err.status = 404;
                throw err;
            }
        } else {
            const err = new Error("Application not found");
            err.status = 404;
            throw err;
        }
    },

    /**
     * The group leader has reject this application
     *
     * @return {Object}
    //  */
    // async reject(ctx) {
    //     if (ctx.is("multipart")) {
    //     } else {
    //         const appId = ctx.request.body.id;
    //         const app = await strapi.services.application.findOne({
    //             id: appId,
    //         });

    //         if (app === null) {
    //             // TODO: Better to return an error message here
    //             return null;
    //         }

    //         const updatedApp = await strapi.services.application.update(
    //             { id: appId },
    //             {
    //                 status: "rejected", // TODO: Change to constants
    //             }
    //         );

    //         return {
    //             application: sanitizeEntity(updatedApp, {
    //                 model: strapi.models.application,
    //             }),
    //         };
    //     }

    //     return null;
    // },
};
