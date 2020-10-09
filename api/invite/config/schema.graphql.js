module.exports = {
  definition: `
    type acceptInvitePayload {
        group: Group
    }
  `,
  query: ``,
  mutation: `
    acceptInvite(id:ID): acceptInvitePayload
  `,
  type: {},
  resolver: {
    Query: {},
    Mutation: {
      acceptInvite: {
        description: "The Invitee accepts the invite",
        resolver: "application::invite.invite.accept",
      },
    },
  },
};
