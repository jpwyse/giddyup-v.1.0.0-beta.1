import axios from "axios";

const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:8000/"
      : "https://giddyup-v1-beta.herokuapp.com/",
  timeout: 5000,
  xsrfHeaderName: "X-CSRFToken",
  xsrfCookieName: "csrftoken",
  headers: { "Content-Type": "application/json" },
});

export default instance;