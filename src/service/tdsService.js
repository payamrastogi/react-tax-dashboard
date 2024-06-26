import axios from "axios";

export function getTDSRecordByOwnerRefId(id) {
  const response = axios.get(
    `${process.env.REACT_APP_API_URL}/api/tds/getByCustomerRefId/${id}`
  );
  return response;
}

export function createTDSRecord(tdsDetails) {
  const response = axios.post(
    `${process.env.REACT_APP_API_URL}/api/tds/add`,
    tdsDetails
  );
  return response;
}

export function updateTDSRecord(tdsDetails) {
  const response = axios.put(
    `${process.env.REACT_APP_API_URL}/api/tds/update/${tdsDetails.id}`,
    tdsDetails
  );
  return response;
}
