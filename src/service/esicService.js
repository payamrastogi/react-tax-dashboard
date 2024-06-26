import axios from "axios";

export function getESICRecordByOwnerRefId(id) {
  const response = axios.get(
    `${process.env.REACT_APP_API_URL}/api/esic/getByCustomerRefId/${id}`
  );
  return response;
}

export function createESICRecord(esicDetails) {
  const response = axios.post(
    `${process.env.REACT_APP_API_URL}/api/esic/add`,
    esicDetails
  );
  return response;
}

export function updateESICRecord(esicDetails) {
  const response = axios.put(
    `${process.env.REACT_APP_API_URL}/api/esic/update/${esicDetails.id}`,
    esicDetails
  );
  return response;
}
