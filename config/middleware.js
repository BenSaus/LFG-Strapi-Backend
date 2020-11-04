module.exports = ({ env }) => ({
  settings: {
    cors: {
      enabled: true,
      //   origin: [env("CORS_URL_1", "")],
      origin: [
        "http://localhost:3000",
        "https://lfg-react-frontend-k88vi.ondigitalocean.app",
      ],
    },
  },
});
