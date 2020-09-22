const SOCKET_SERVER =
  process.env.NODE_ENV === "production"
    ? "https://lit-hamlet-62877.herokuapp.com/"
    : "http://localhost:8080/";

export default {
  SOCKET_SERVER,
};
