import axios from "axios";

export default axios.create({
  baseURL: "http://13.250.38.51/api",
  headers: {
    "Content-Type": "application/json",
    "withCredentials": false,
    "Access-Control-Allow-Origin": "*",
  },
});