import axios from "axios";
import Axios from "axios";

export const sendPostRequest = (url, data) => {
  return axios.post(url, data).then((result) => result.data);
};
export const sendGetRequest = (url) => {
  return axios.get(url).then((result) => result.data);
};
export const getRequest = (url) => {
  Axios.get(url).then((response) => {
    return response.data;
  });
};

export const postDataAPI = async (url, data) => {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson;
    })
    .catch((err) => {
      console.log(err);
    });
  return res;
};
