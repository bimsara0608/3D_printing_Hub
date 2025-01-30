// src/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000", // Set the base URL of your backend server
});

export default instance;
