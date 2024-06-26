import axios from "axios";

export function createCustomer(customerDetails) {
  const response = axios.post(
    `${process.env.REACT_APP_API_URL}/api/customer/add`,
    customerDetails
  );
  return response;
}

export function getCustomers() {
  const response = axios.get(
    `${process.env.REACT_APP_API_URL}/api/customer/getAll`
  );
  return response;
}

export function getCustomerById(id) {
  const response = axios.get(
    `${process.env.REACT_APP_API_URL}/api/customer/getById/${id}`
  );
  return response;
}

export function updateCustomer(customerDetails) {
  const response = axios.put(
    `${process.env.REACT_APP_API_URL}/api/customer/update/${customerDetails.id}`,
    customerDetails
  );
  return response;
}
