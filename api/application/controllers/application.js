"use strict";
const { parseMultipartData, sanitizeEntity } = require("strapi-utils");
/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    /**
     * Create application override
     *
     * @return {Object}
     */

    async create(ctx) {
        const applicantId = ctx.request.body.applicant;
        const message = ctx.request.body.message;
        const groupId = ctx.stat.body.group;
        const requestingUserId = ctx.state.user.id;

        // TODO: VALIDATE HERE...

        // Requestor can only create applications for themselves, applicant ID and requestingUserId must match
        if (Number(applicantId) === requestingUserId) {
            // Group must exist
            const group = await strapi.services.group.findOne({ id: groupId });

            if (group !== null) {
                // Requestor cannot be a member of the group already
                for (const member of group.members) {
                    if (member.id === Number(applicantId)) {
                        const err = new Error("Already a member");
                        err.status = 403;
                        throw err;
                    }
                }

                // Check for duplicate applications
                const application = await strapi.services.application.findOne({
                    applicant: userId,
                    group: groupId,
                });

                if (application) {
                    const err = new Error("Existing application found");
                    err.status = 403;
                    throw err;
                } else {
                    const newApplication = await strapi.services.application.create(
                        {
                            applicant: requestingUserId,
                            group: groupId,
                            message,
                            status: "undecided",
                        }
                    );
                    return sanitizeEntity(newApplication, {
                        model: strapi.models.application,
                    });
                }
            } else {
                const err = new Error("Group not found");
                err.status = 404;
                throw err;
            }
        } else {
            const err = new Error("Not authorized");
            err.status = 403;
            throw err;
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

        if (application !== null) {
            const group = await strapi.services.group.findOne({
                id: application.group.id,
            });

            if (group !== null) {
                // Requestor must be the group leader
                if (requestingUserId === group.leader.id) {
                    const applicantId = application.applicant.id;
                    const currentMemberIds = group.members.map(
                        (member) => member.id
                    );
                    currentMemberIds.push(applicantId);

                    const updatedApp = await strapi.services.application.update(
                        { id: applicationId },
                        {
                            status: "accepted", // TODO: Change to constants
                        }
                    );

                    const updatedGroup = await strapi.services.group.update(
                        { id: group.id },
                        {
                            members: currentMemberIds,
                        }
                    );

                    return {
                        group: sanitizeEntity(updatedGroup, {
                            model: strapi.models.group,
                        }),
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
