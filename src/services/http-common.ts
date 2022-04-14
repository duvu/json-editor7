import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
    "withCredentials": false,
    "Access-Control-Allow-Origin": "*",
  },
});