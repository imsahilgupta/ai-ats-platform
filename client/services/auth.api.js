import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/api/auth`
    : "http://localhost:3000/api/auth",
  withCredentials: true,
});

export async function register({ username, email, password }) {
  try {
    const response = await api.post("/register", {
      username,
      email,
      password,
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function login({ email, password }) {
  try {
    const response = await api.post("/login", {
      email,
      password,
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function logout() {
  try {
    const response = await api.get("/logout");
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getMe() {
  try {
    const response = await api.get("/get-me");
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function updateUsername({ username }) {
  try {
    const response = await api.patch("/update-username", { username });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function deleteAccount() {
  try {
    const response = await api.delete("/delete-account");
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
