module.exports = ({ env }) => ({
  settings: {
    cors: {
      origin: [
        "http://localhost:3000",
        "https://lfg-react-frontend-k88vi.ondigitalocean.app",
        "http://167.71.126.201",
      ],
    },
  },
});
