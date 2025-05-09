import axios from "axios";

export function signIn(credentials) {
  const request = {
    credentials: credentials,
  };
  const response = axios.post(
    `${process.env.REACT_APP_API_URL}/api/auth/signin`,
    request
  );
  return response;
}
