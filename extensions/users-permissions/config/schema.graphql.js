module.exports = {
  definition: `
        type UsersPermissionsMeExtra {
            id: ID!
            username: String!
            about: String
            age: Int
            hide_age: Boolean
            email: String!
            open_to_invite: Boolean!
            image: UploadFile
            achievements: [Achievement]
        }

      `,
  query: `
    meExtra: UsersPermissionsMeExtra
    `,
  mutation: ``,
  type: {},
  resolver: {
    Query: {
      meExtra: {
        resolver: "plugins::users-permissions.user.meExtra",
      },
    },
  },
};

// https://github.com/strapi/strapi/blob/4a27d9d46bf52fbb8d5406de4d73aa920db8c9aa/packages/strapi-plugin-users-permissions/config/schema.graphql.js
