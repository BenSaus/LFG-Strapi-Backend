const strapiUser = require("../helpers/strapiUser");
const LFGActions = require("../helpers/lfgActions");
const errorCodes = require("../../api/errorCodes");
const mockData = require("../group/mockData");

const INVALID_ID = 999999;
const APPLICATION_STATUS_UNDECIDED = "undecided";

let testUser = null;
let testUsers = null;
let lfgActions = null;

beforeAll(async (done) => {
    lfgActions = new LFGActions(strapi);

    testUsers = await strapiUser.getTestUsers();
    testUser = testUsers[0];

    done();
});

it("Create application", async (done) => {
    const testUser2 = testUsers[1];

    const { group } = await lfgActions.userCreateGroup(
        mockData.generalGroupData,
        testUser,
        "Create application"
    );
    console.log(`⚠️ ~ file: application.js ~ line 30 ~ it ~ group`, group);

    const message = "my message";

    const { application, errors } = await lfgActions.userCreateApplication(
        testUser2,
        group.id,
        message
    );

    expect(errors).toBeUndefined();
    expect(application).toBeDefined();
    console.log(
        `⚠️ ~ file: application.js ~ line 41 ~ it ~ application`,
        application
    );
    expect(application.status).toBe(APPLICATION_STATUS_UNDECIDED);
    expect(application.message).toBe(message);
    expect(application.group.id).toBe(group.id);
    expect(application.applicant.id).toBe(testUser2.id.toString());
    expect(application.group_leader_dismissed).toBe(false);

    done();
});

// it("Create application, error duplicate")
// it("Create application, error already a member")
// it("Create application, error you are the leader")
// it("Create application, error invite exists")
// it("Create application, error group is closed")
// it("Create application, error group not found")
