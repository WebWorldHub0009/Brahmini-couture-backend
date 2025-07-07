import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // <-- update this later to your backend server URL
  withCredentials: true, // optional, only if you're using cookies/auth
});

export default api;
