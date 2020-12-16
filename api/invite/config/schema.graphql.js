module.exports = {
    definition: `
        type acceptInvitePayload {
            group: Group
            invite: Invite
        }

        type dismissInvitePayload {
            invite: Invite
        }
  `,
    query: ``,
    mutation: `
        acceptInvite(id:ID): acceptInvitePayload
        dismissInvite(id:ID): dismissInvitePayload
  `,
    type: {},
    resolver: {
        Query: {},
        Mutation: {
            acceptInvite: {
                description: "The Invitee accepts the invite",
                resolver: "application::invite.invite.accept",
            },
            dismissInvite: {
                description: "The Invitee accepts the invite",
                resolver: "application::invite.invite.dismiss",
                // resolverOf: "application::invite.invite.dismiss",
                // resolver: async (obj, options, { context }) => {
                //     console.log("Resolver!");
                //     console.log(obj);
                //     console.log(options);
                //     console.log(context);
                // },
            },
        },
    },
};
