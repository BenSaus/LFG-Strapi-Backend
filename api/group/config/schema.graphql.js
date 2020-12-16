module.exports = {
    definition: `
    type removeMemberPayload {
        group: Group
    }
    type leaveGroupPayload {
        group: Group
    }

  `,
    query: ``,
    mutation: `
        removeMember(groupId:ID, memberId:ID): removeMemberPayload
        leaveGroup(id:ID): leaveGroupPayload

  `,
    type: {},
    resolver: {
        Query: {},
        Mutation: {
            removeMember: {
                description: "Remove the given member from the given group",
                resolver: "application::group.group.removeMember",
            },
            leaveGroup: {
                description: "Remove logged in user from the given group",
                resolver: "application::group.group.leaveGroup",
            },
        },
    },
};
