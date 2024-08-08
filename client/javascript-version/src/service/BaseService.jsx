import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

async function callApi(method, url, data = null) {
  try {
    // Get token from local storage
    const token = localStorage.getItem('token');

    // Add token to Authorization header if it exists
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      // If token is not present and the route is not login or register, redirect to 401 page
      if (url !== '/api/users/login' && url !== '/api/users/register') {
        window.location.href = '/pages/401_error';
        return; // Stop further execution
      }
    }

    // Make request with the specified method, url, data, and headers
    const response = await api({
      method,
      url,
      data,
      headers
    });

    // Return response object
    return {
      status: response.status,
      data: response.data,
      headers: response.headers,
    };
  } catch (error) {
    // If an error occurs, check if it's due to token expiration
    if (error.response && error.response.status === 401 && error.response.data.message === 'Token expired') {
      // Remove token from localStorage
      localStorage.removeItem('token');
      
      // Remove token from cookies (if any)
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

      // Redirect to 401 error page
      window.location.href = '/pages/401_error';
    } else {
      // If the error is not due to token expiration, return error response
      return {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      };
    }
  }
}





export async function getAPI(url) {
  return callApi("get", url);
}

export async function postAPI(url, data) {
  return callApi("post", url, data);
}

export async function putAPI(url, data) {
  return callApi("put", url, data);
}

export async function deleteAPI(url) {
  return callApi("delete", url);
}

export async function patchAPI(url, data) {
  return callApi("patch", url, data);
}
