const roomSeed = require("./seedData/rooms.json");
const businessSeed = require("./seedData/businesses.json");
const achievementSeed = require("./seedData/achievements.json");
const groupSeed = require("./seedData/groups.json");
const userSeed = require("./seedData/users.json");
const inviteSeed = require("./seedData/invites.json");
const applicationSeed = require("./seedData/applications.json");

async function createSeedData(strapi) {
    console.log("Creating fake data...");

    const businesses = await createBusinesses(strapi);
    // console.log(businesses);
    const rooms = await createRooms(strapi, businesses);
    // console.log(rooms);
    const achievements = await createAchievements(strapi);
    // console.log(achievements);

    const users = await createUsers(strapi, achievements);
    // console.log(users);
    const groups = await createGroups(strapi, users);
    // console.log(groups);

    const invites = await createInvites(strapi, users, groups);
    // console.log(invites);
    const applications = await createApplications(strapi, users, groups);
    // console.log(applications);
}

async function createBusinesses(strapi) {
    let businesses = [];
    if ((await strapi.query("business").count()) === 0) {
        console.log("Creating businesses...");

        for (let business of businessSeed) {
            const resp = await strapi.services.business.create(business);
            businesses.push(resp);
        }
    } else {
        businesses = await strapi.services.business.find();
    }

    return businesses;
}

async function createRooms(strapi, businesses) {
    let rooms = [];

    if ((await strapi.query("room").count()) === 0) {
        console.log("Creating rooms...");
        for (let room of roomSeed) {
            room.business = getBusinessId(room._businessName, businesses);
            const resp = await strapi.services.room.create(room);
            rooms.push(resp);
        }
    } else {
        rooms = await strapi.services.room.find();
    }

    return rooms;
}

function getBusinessId(businessName, businesses) {
    for (let business of businesses) {
        if (business.name === businessName) return business.id;
    }
    throw new Error("Name not found: " + businessName);
}

async function createAchievements(strapi) {
    let achievements = [];
    if ((await strapi.query("achievement").count()) === 0) {
        console.log("Creating achievements...");
        for (let achievement of achievementSeed) {
            const resp = await strapi.services.achievement.create(achievement);
            achievements.push(resp);
        }
    } else {
        achievements = await strapi.services.achievement.find();
    }
    return achievements;
}

async function createUsers(strapi, achievements) {
    let users = [];
    if (
        (await strapi.plugins["users-permissions"].services.user.count()) === 0
    ) {
        console.log("Creating users...");
        for (let user of userSeed) {
            const filledUser = { ...user };
            filledUser.achievements = getAchievementIds(
                user._achievementNames,
                achievements
            );
            filledUser.password = "123456";

            const resp = await strapi.plugins[
                "users-permissions"
            ].services.user.add(filledUser);
            users.push(resp);
        }
    } else {
        users = strapi.plugins["users-permissions"].services.user.fetchAll();
    }
    return users;
}

function getAchievementIds(achievementNames, achievements) {
    const ids = [];
    for (let name of achievementNames) {
        for (let achievement of achievements) {
            if (name === achievement.name) {
                ids.push(achievement.id);
                break;
            }
        }
    }

    return ids;
}

async function createGroups(strapi, users) {
    let groups = [];
    if ((await strapi.query("group").count()) === 0) {
        console.log("Creating groups...");
        for (let group of groupSeed) {
            const filledGroup = { ...group };
            filledGroup.leader = getUserId(group._leader_name, users);
            filledGroup.members = getUserIds(group._member_names, users);
            const resp = await strapi.services.group.create(filledGroup);
            groups.push(resp);
        }
    } else {
        groups = await strapi.services.group.find();
    }
    return groups;
}

function getUserId(username, users) {
    for (let user of users) {
        if (user.username === username) return user.id;
    }
    throw new Error("Name not found: " + username);
}

function getUserIds(usernames, users) {
    const ids = [];
    for (let username of usernames) {
        ids.push(getUserId(username, users));
    }
    return ids;
}

async function createInvites(strapi, users, groups) {
    let invites = [];
    if ((await strapi.query("invite").count()) === 0) {
        console.log("Creating invites...");
        for (let invite of inviteSeed) {
            const filledInvite = { ...invite };
            filledInvite.group = getGroupId(invite._group_name, groups);
            filledInvite.invitee = getUserId(invite._invitee_name, users);

            const resp = await strapi.services.invite.create(filledInvite);
            invites.push(resp);
        }
    } else {
        invites = await strapi.services.invite.find();
    }
    return invites;
}

function getGroupId(groupName, groups) {
    for (let group of groups) {
        if (group.name === groupName) return group.id;
    }
    throw new Error("Name not found: " + groupName);
}

async function createApplications(strapi, users, groups) {
    let applications = [];
    if ((await strapi.query("application").count()) === 0) {
        console.log("Creating applications...");
        for (let application of applicationSeed) {
            const filledApplication = { ...application };
            filledApplication.group = getGroupId(
                application._group_name,
                groups
            );
            filledApplication.applicant = getUserId(
                application._applicant_name,
                users
            );

            const resp = await strapi.services.application.create(
                filledApplication
            );
            applications.push(resp);
        }
    } else {
        applications = await strapi.services.application.find();
    }
    return applications;
}

module.exports = {
    createSeedData,
};
