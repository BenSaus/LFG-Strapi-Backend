"use strict";
const fs = require("fs");

// TODO: Turn into a singleton

function loadFiles(path) {
    const files = fs.readdirSync(path);
    const output = {};
    for (let filename of files) {
        const contents = fs.readFileSync(`${path}/${filename}`, "utf8");
        const filenameNoExt = filename.split(".")[0];
        output[filenameNoExt] = contents;
    }

    return output;
}

const mutations = loadFiles("tests/helpers/graphql/mutations");
const queries = loadFiles("tests/helpers/graphql/queries");

module.exports = {
    mutations,
    queries,
};
