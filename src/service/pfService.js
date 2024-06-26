import axios from "axios";

export function getPFRecordByOwnerRefId(id) {
  const response = axios.get(
    `${process.env.REACT_APP_API_URL}/api/pf/getByCustomerRefId/${id}`
  );
  return response;
}

export function createPFRecord(pfDetails) {
  const response = axios.post(
    `${process.env.REACT_APP_API_URL}/api/pf/add`,
    pfDetails
  );
  return response;
}

export function updatePFRecord(pfDetails) {
  const response = axios.put(
    `${process.env.REACT_APP_API_URL}/api/pf/update/${pfDetails.id}`,
    pfDetails
  );
  return response;
}
