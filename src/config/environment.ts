const SOCKET_SERVER =
  process.env.mode === "production"
    ? "https://lit-hamlet-62877.herokuapp.com/"
    : "http://localhost:8080/";

export default {
  SOCKET_SERVER,
};
