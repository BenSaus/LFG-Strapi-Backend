module.exports = {
    definition: `
        #type inviteUserPayload {
        #    invite: Invite
        #}

        #input inviteUserInput {
        #    inviteeId: ID
        #    groupId: ID
        #    message: String
        #}

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
        # TODO: Any way to override createInvite input type? Using createInvite instead of this for now
        # inviteUser(input: inviteUserInput): inviteUserPayload
        acceptInvite(id: ID): acceptInvitePayload
        rejectInvite(id: ID): rejectInvitePayload
        dismissInvite(id: ID): dismissInvitePayload
  `,
    type: {},
    resolver: {
        Query: {},
        Mutation: {
            createInvite: {
                description: "Create an invitation",
                resolver: "application::invite.invite.create",
            },
            updateInvite: false,
            deleteInvite: false,

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
