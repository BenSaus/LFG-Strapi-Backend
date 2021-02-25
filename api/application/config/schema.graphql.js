module.exports = {
    definition: `
      type acceptApplicationPayload {
          application: Application
      }

      type rejectApplicationPayload {
          application: Application
      }
    `,
    query: ``,
    mutation: `
      acceptApplication(id:ID): acceptApplicationPayload
      rejectApplication(id:ID): rejectApplicationPayload
    `,
    type: {},
    resolver: {
        Query: {},
        Mutation: {
            createApplication: {
                description: "Create an application",
                resolver: "application::application.application.create",
            },
            updateApplication: false,
            deleteApplication: false,
            acceptApplication: {
                description: "The group leader accepts the application",
                resolver: "application::application.application.accept",
            },
            rejectApplication: {
                description: "The group leader rejects the application",
                resolver: "application::application.application.reject",
            },
        },
    },
};
