const authenticatedPermissions = {
    permissions: {
        application: {
            controllers: {
                achievement: {
                    count: { enabled: true, policy: "" },
                    create: { enabled: true, policy: "" },
                    delete: { enabled: true, policy: "" },
                    find: { enabled: true, policy: "" },
                    findone: { enabled: true, policy: "" },
                    update: { enabled: true, policy: "" },
                },
                application: {
                    accept: { enabled: true, policy: "" },
                    count: { enabled: true, policy: "" },
                    create: { enabled: true, policy: "" },
                    delete: { enabled: true, policy: "" },
                    find: { enabled: true, policy: "" },
                    findone: { enabled: true, policy: "" },
                    reject: { enabled: true, policy: "" },
                    update: { enabled: true, policy: "" },
                },
                business: {
                    count: { enabled: true, policy: "" },
                    create: { enabled: true, policy: "" },
                    delete: { enabled: true, policy: "" },
                    find: { enabled: true, policy: "" },
                    findone: { enabled: true, policy: "" },
                    update: { enabled: true, policy: "" },
                },
                group: {
                    count: { enabled: true, policy: "" },
                    create: { enabled: true, policy: "" },
                    delete: { enabled: true, policy: "" },
                    find: { enabled: true, policy: "" },
                    findone: { enabled: true, policy: "" },
                    update: { enabled: true, policy: "" },
                    removeMember: { enabled: true, policy: "" },
                    leaveGroup: { enabled: true, policy: "" },
                },
                invite: {
                    accept: { enabled: true, policy: "" },
                    reject: { enabled: true, policy: "" },
                    count: { enabled: true, policy: "" },
                    create: { enabled: true, policy: "" },
                    delete: { enabled: true, policy: "" },
                    find: { enabled: true, policy: "" },
                    findone: { enabled: true, policy: "" },
                    update: { enabled: true, policy: "" },
                },
                room: {
                    count: { enabled: true, policy: "" },
                    create: { enabled: true, policy: "" },
                    delete: { enabled: true, policy: "" },
                    find: { enabled: true, policy: "" },
                    findone: { enabled: true, policy: "" },
                    update: { enabled: true, policy: "" },
                },
            },
        },

        "users-permissions": {
            controllers: {
                auth: {
                    callback: { enabled: true, policy: "" },
                    connect: { enabled: true, policy: "" },
                    emailconfirmation: { enabled: true, policy: "" },
                    forgotpassword: { enabled: true, policy: "" },
                    register: { enabled: true, policy: "" },
                    resetpassword: { enabled: true, policy: "" },
                    sendemailconfirmation: { enabled: false, policy: "" },
                },
                user: {
                    count: { enabled: false, policy: "" },
                    create: { enabled: false, policy: "" },
                    destroy: { enabled: false, policy: "" },
                    destroyall: { enabled: false, policy: "" },
                    find: { enabled: true, policy: "" },
                    findone: { enabled: true, policy: "" },
                    me: { enabled: true, policy: "" },
                    meextra: { enabled: true, policy: "" },
                    update: { enabled: false, policy: "" },
                },
                userspermissions: {
                    createrole: { enabled: false, policy: "" },
                    deleterole: { enabled: false, policy: "" },
                    getadvancedsettings: { enabled: false, policy: "" },
                    getemailtemplate: { enabled: false, policy: "" },
                    getpermissions: { enabled: false, policy: "" },
                    getpolicies: { enabled: false, policy: "" },
                    getproviders: { enabled: false, policy: "" },
                    getrole: { enabled: false, policy: "" },
                    getroles: { enabled: false, policy: "" },
                    getroutes: { enabled: false, policy: "" },
                    index: { enabled: false, policy: "" },
                    searchusers: { enabled: false, policy: "" },
                    updateadvancedsettings: { enabled: false, policy: "" },
                    updateemailtemplate: { enabled: false, policy: "" },
                    updateproviders: { enabled: false, policy: "" },
                    updaterole: { enabled: false, policy: "" },
                },
            },
            information: {
                description: {
                    short:
                        "Protect your API with a full authentication process based on JWT",
                    long:
                        "Protect your API with a full authentication process based on JWT. This plugin comes also with an ACL strategy that allows you to manage the permissions between the groups of users.",
                },
                id: "users-permissions",
                icon: "users",
                logo:
                    "https://raw.githubusercontent.com/strapi/strapi/master/packages/strapi-plugin-users-permissions/admin/src/assets/images/logo.svg?sanitize=true",
                isCompatible: true,
                name: "Roles & Permissions",
                price: 0,
                ratings: 5,
                registry: "https://registry.npmjs.org/",
            },
        },
    },
};

const publicPermissions = {
    name: "Public",
    description: "Default role given to unauthenticated user.",
    permissions: {
        application: {
            controllers: {
                achievement: {
                    count: { enabled: true, policy: "" },
                    create: { enabled: true, policy: "" },
                    delete: { enabled: true, policy: "" },
                    find: { enabled: true, policy: "" },
                    findone: { enabled: true, policy: "" },
                    update: { enabled: true, policy: "" },
                },
                application: {
                    accept: { enabled: true, policy: "" },
                    count: { enabled: true, policy: "" },
                    create: { enabled: true, policy: "" },
                    delete: { enabled: true, policy: "" },
                    find: { enabled: true, policy: "" },
                    findone: { enabled: true, policy: "" },
                    reject: { enabled: true, policy: "" },
                    update: { enabled: true, policy: "" },
                },
                business: {
                    count: { enabled: true, policy: "" },
                    create: { enabled: true, policy: "" },
                    delete: { enabled: true, policy: "" },
                    find: { enabled: true, policy: "" },
                    findone: { enabled: true, policy: "" },
                    update: { enabled: true, policy: "" },
                },
                group: {
                    count: { enabled: true, policy: "" },
                    create: { enabled: true, policy: "" },
                    delete: { enabled: true, policy: "" },
                    find: { enabled: true, policy: "" },
                    findone: { enabled: true, policy: "" },
                    update: { enabled: true, policy: "" },
                },
                invite: {
                    accept: { enabled: true, policy: "" },
                    count: { enabled: true, policy: "" },
                    create: { enabled: true, policy: "" },
                    delete: { enabled: true, policy: "" },
                    find: { enabled: true, policy: "" },
                    findone: { enabled: true, policy: "" },
                    update: { enabled: true, policy: "" },
                },
                room: {
                    count: { enabled: true, policy: "" },
                    create: { enabled: true, policy: "" },
                    delete: { enabled: true, policy: "" },
                    find: { enabled: true, policy: "" },
                    findone: { enabled: true, policy: "" },
                    update: { enabled: true, policy: "" },
                },
            },
        },
        "content-manager": {
            controllers: {
                components: {
                    findcomponent: { enabled: false, policy: "" },
                    listcomponents: { enabled: false, policy: "" },
                    updatecomponent: { enabled: false, policy: "" },
                },
                contentmanager: {
                    checkuidavailability: { enabled: false, policy: "" },
                    count: { enabled: false, policy: "" },
                    create: { enabled: false, policy: "" },
                    delete: { enabled: false, policy: "" },
                    deletemany: { enabled: false, policy: "" },
                    find: { enabled: false, policy: "" },
                    findone: { enabled: false, policy: "" },
                    findrelationlist: { enabled: false, policy: "" },
                    generateuid: { enabled: false, policy: "" },
                    publish: { enabled: false, policy: "" },
                    unpublish: { enabled: false, policy: "" },
                    update: { enabled: false, policy: "" },
                },
                contenttypes: {
                    findcontenttype: { enabled: false, policy: "" },
                    listcontenttypes: { enabled: false, policy: "" },
                    updatecontenttype: { enabled: false, policy: "" },
                },
            },
            information: {
                description: {
                    short:
                        "Quick way to see, edit and delete the data in your database.",
                    long:
                        "Quick way to see, edit and delete the data in your database.",
                },
                id: "content-manager",
                icon: "plug",
                logo:
                    "https://raw.githubusercontent.com/strapi/strapi/master/packages/strapi-plugin-content-manager/admin/src/assets/images/logo.svg?sanitize=true",
                isCompatible: true,
                name: "Content Manager",
                price: 0,
                ratings: 5,
                registry: "https://registry.npmjs.org/",
            },
        },
        "content-type-builder": {
            controllers: {
                builder: { getreservednames: { enabled: false, policy: "" } },
                componentcategories: {
                    deletecategory: { enabled: false, policy: "" },
                    editcategory: { enabled: false, policy: "" },
                },
                components: {
                    createcomponent: { enabled: false, policy: "" },
                    deletecomponent: { enabled: false, policy: "" },
                    getcomponent: { enabled: false, policy: "" },
                    getcomponents: { enabled: false, policy: "" },
                    updatecomponent: { enabled: false, policy: "" },
                },
                connections: { getconnections: { enabled: false, policy: "" } },
                contenttypes: {
                    createcontenttype: { enabled: false, policy: "" },
                    deletecontenttype: { enabled: false, policy: "" },
                    getcontenttype: { enabled: false, policy: "" },
                    getcontenttypes: { enabled: false, policy: "" },
                    updatecontenttype: { enabled: false, policy: "" },
                },
            },
            information: {
                description: {
                    short: "Modelize the data structure of your API.",
                    long:
                        "Modelize the data structure of your API. Create new fields and relations in just a minute. The files are automatically created and updated in your project.",
                },
                id: "content-type-builder",
                icon: "paint-brush",
                logo:
                    "https://raw.githubusercontent.com/strapi/strapi/master/packages/strapi-plugin-content-type-builder/admin/src/assets/images/logo.svg?sanitize=true",
                isCompatible: true,
                name: "Content Type Builder",
                price: 0,
                ratings: 5,
                registry: "https://registry.npmjs.org/",
            },
        },
        email: {
            controllers: { email: { send: { enabled: false, policy: "" } } },
            information: {
                description: { short: "Send emails.", long: "Send emails." },
                id: "email",
                icon: "paper-plane",
                logo:
                    "https://raw.githubusercontent.com/strapi/strapi/master/packages/strapi-plugin-email/admin/src/assets/images/logo.svg?sanitize=true",
                isCompatible: true,
                name: "Email",
                price: 0,
                ratings: 5,
                registry: "https://registry.npmjs.org/",
            },
        },
        upload: {
            controllers: {
                upload: {
                    count: { enabled: false, policy: "" },
                    destroy: { enabled: false, policy: "" },
                    find: { enabled: false, policy: "" },
                    findone: { enabled: false, policy: "" },
                    getsettings: { enabled: false, policy: "" },
                    search: { enabled: false, policy: "" },
                    updatesettings: { enabled: false, policy: "" },
                    upload: { enabled: false, policy: "" },
                },
            },
            information: {
                description: {
                    short: "Media file management.",
                    long: "Media file management.",
                },
                id: "upload",
                icon: "cloud-upload-alt",
                logo:
                    "https://raw.githubusercontent.com/strapi/strapi/master/packages/strapi-plugin-upload/admin/src/assets/images/logo.svg?sanitize=true",
                isCompatible: true,
                name: "Media Library",
                price: 0,
                ratings: 5,
                registry: "https://registry.npmjs.org/",
            },
        },
        "users-permissions": {
            controllers: {
                auth: {
                    callback: { enabled: true, policy: "" },
                    connect: { enabled: true, policy: "" },
                    emailconfirmation: { enabled: true, policy: "" },
                    forgotpassword: { enabled: true, policy: "" },
                    register: { enabled: true, policy: "" },
                    resetpassword: { enabled: true, policy: "" },
                    sendemailconfirmation: { enabled: false, policy: "" },
                },
                user: {
                    count: { enabled: false, policy: "" },
                    create: { enabled: false, policy: "" },
                    destroy: { enabled: false, policy: "" },
                    destroyall: { enabled: false, policy: "" },
                    find: { enabled: true, policy: "" },
                    findone: { enabled: true, policy: "" },
                    me: { enabled: true, policy: "" },
                    meextra: { enabled: true, policy: "" },
                    update: { enabled: false, policy: "" },
                },
                userspermissions: {
                    createrole: { enabled: false, policy: "" },
                    deleterole: { enabled: false, policy: "" },
                    getadvancedsettings: { enabled: false, policy: "" },
                    getemailtemplate: { enabled: false, policy: "" },
                    getpermissions: { enabled: false, policy: "" },
                    getpolicies: { enabled: false, policy: "" },
                    getproviders: { enabled: false, policy: "" },
                    getrole: { enabled: false, policy: "" },
                    getroles: { enabled: false, policy: "" },
                    getroutes: { enabled: false, policy: "" },
                    index: { enabled: false, policy: "" },
                    searchusers: { enabled: false, policy: "" },
                    updateadvancedsettings: { enabled: false, policy: "" },
                    updateemailtemplate: { enabled: false, policy: "" },
                    updateproviders: { enabled: false, policy: "" },
                    updaterole: { enabled: false, policy: "" },
                },
            },
            information: {
                description: {
                    short:
                        "Protect your API with a full authentication process based on JWT",
                    long:
                        "Protect your API with a full authentication process based on JWT. This plugin comes also with an ACL strategy that allows you to manage the permissions between the groups of users.",
                },
                id: "users-permissions",
                icon: "users",
                logo:
                    "https://raw.githubusercontent.com/strapi/strapi/master/packages/strapi-plugin-users-permissions/admin/src/assets/images/logo.svg?sanitize=true",
                isCompatible: true,
                name: "Roles & Permissions",
                price: 0,
                ratings: 5,
                registry: "https://registry.npmjs.org/",
            },
        },
    },
    users: [],
};

module.exports = {
    publicPermissions,
    authenticatedPermissions,
};
