import axios from "axios";

export function getMCARecordByOwnerRefId(id) {
  const response = axios.get(
    `${process.env.REACT_APP_API_URL}/api/mca/getByCustomerRefId/${id}`
  );
  return response;
}

export function createMCARecord(mcaDetails) {
  const response = axios.post(
    `${process.env.REACT_APP_API_URL}/api/mca/add`,
    mcaDetails
  );
  return response;
}

export function updateMCARecord(mcaDetails) {
  const response = axios.put(
    `${process.env.REACT_APP_API_URL}/api/mca/update/${mcaDetails.id}`,
    mcaDetails
  );
  return response;
}
