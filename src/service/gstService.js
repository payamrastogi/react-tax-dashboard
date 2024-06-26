import axios from "axios";

export function getGSTRecordByOwnerRefId(id) {
  const response = axios.get(
    `${process.env.REACT_APP_API_URL}/api/gst/getByCustomerRefId/${id}`
  );
  return response;
}

export function createGSTRecord(gstDetails) {
  const response = axios.post(
    `${process.env.REACT_APP_API_URL}/api/gst/add`,
    gstDetails
  );
  return response;
}

export function updateGSTRecord(gstDetails) {
  const response = axios.put(
    `${process.env.REACT_APP_API_URL}/api/gst/update/${gstDetails.id}`,
    gstDetails
  );
  return response;
}
