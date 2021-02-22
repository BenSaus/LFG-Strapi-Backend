const Strapi = require("strapi");
const http = require("http");

// Singleton
let instance;

async function setupStrapi() {
    if (!instance) {
        await Strapi().load();
        instance = strapi; // strapi is global now
        await instance.app
            .use(instance.router.routes()) // populate KOA routes
            .use(instance.router.allowedMethods()); // populate KOA methods

        instance.server = http.createServer(instance.app.callback());
    }
    return instance;
}
module.exports = { setupStrapi };
