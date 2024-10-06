import axios from "axios";

export function getPersonByPan(panNumber) {
  const payload = {
    panNumber: panNumber,
  };
  const response = axios.post(
    `${process.env.REACT_APP_API_URL}/api/person/fetchByPan`,
    payload
  );
  return response;
}
