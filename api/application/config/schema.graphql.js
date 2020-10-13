module.exports = {
  definition: `
      type acceptApplicationPayload {
          group: Group
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
