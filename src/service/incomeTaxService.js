import axios from "axios";

export function getIncomeTaxRecordByOwnerRefId(id) {
  const response = axios.get(
    `${process.env.REACT_APP_API_URL}/api/incomeTax/getByCustomerRefId/${id}`
  );
  // .catch((error) => {
  //   console.log(error);
  //   return undefined;
  // });
  return response;
}

export function createIncomeTaxRecord(incomeTaxDetails) {
  const response = axios.post(
    `${process.env.REACT_APP_API_URL}/api/incomeTax/add`,
    incomeTaxDetails
  );
  // .catch((error) => {
  //   console.log(error);
  //   return undefined;
  // });
  return response;
}

export function updateIncomeTaxRecord(incomeTaxDetails) {
  const response = axios.put(
    `${process.env.REACT_APP_API_URL}/api/incomeTax/update/${incomeTaxDetails.id}`,
    incomeTaxDetails
  );
  return response;
}
