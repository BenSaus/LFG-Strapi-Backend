module.exports = ({ env }) => ({
  load: {
    before: ["cors"],
  },
  settings: {
    cors: {
      enabled: true,
      origin: "*",
    },
  },
});
