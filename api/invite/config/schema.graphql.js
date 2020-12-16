module.exports = {
    definition: `
        type acceptInvitePayload {
            group: Group
            invite: Invite
        }
        type rejectInvitePayload {
            invite: Invite
        }

        type dismissInvitePayload {
            invite: Invite
        }
  `,
    query: ``,
    mutation: `
        acceptInvite(id:ID): acceptInvitePayload
        rejectInvite(id:ID): rejectInvitePayload
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
            rejectInvite: {
                description: "The Invitee accepts the invite",
                resolver: "application::invite.invite.reject",
            },
            dismissInvite: {
                description: "The Invitee accepts the invite",
                resolver: "application::invite.invite.dismiss",
            },
        },
    },
};
