module.exports = ({ env }) => ({
  settings: {
    cors: {
      enabled: false,
      origin: [
        "http://localhost:3000",
        "https://lfg-react-frontend-k88vi.ondigitalocean.app",
      ],
    },
  },
});
