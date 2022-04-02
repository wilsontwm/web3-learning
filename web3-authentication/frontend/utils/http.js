import config from "../config";
import { toast } from "react-toastify";

const { API_ROOT_URL } = config;

export const defaultHeaders = {
  Accept: "application/json",
  "Accept-Charset": "utf-8",
  "Content-type": "application/json",
};

export const formatUri = (uri) => {
  if (new RegExp("^http|https").test(uri)) return `${uri}`;
  return `${API_ROOT_URL}${uri}`;
};

const rxOne = /^[\],:{}\s]*$/;
const rxTwo = /\\(?:["\\/bfnrt]|u[0-9a-fA-F]{4})/g;
const rxThree = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?/g;
const rxFour = /(?:^|:|,)(?:\s*\[)+/g;
const isJSON = (input) => input.length && rxOne.test(input.replace(rxTwo, "@").replace(rxThree, "]").replace(rxFour, ""));

const fetching = (uriInput = "", method = "GET", body = {}) => {
  const uri = formatUri(uriInput);
  // console.log("Fetch uri : ", uri);
  const jsonBody = JSON.stringify(body);

  //const { accessToken } = useAuthStore().user;
  const accessToken = "TODO";
  const customHeaders = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Length": `${jsonBody.length}`,
  };
  const headers = Object.assign(defaultHeaders, customHeaders);
  const data = {
    method,
    headers,
    body: jsonBody,
    mode: "cors",
    credentials: "include",
  };
  if (method === "GET") delete data.body;

  const fetchAPI = fetch(uri, data)
    .then((resp) => {
      if (!resp.ok) {
        return resp.text().then((text) => {
          // console.log('Fetch pure response : ', text);
          const json = isJSON(text) ? JSON.parse(text) : {};
          toast.error(json.message);

          return Promise.reject({
            statusCode: resp.status,
            message: json.message,
          });
        });
      }
      return resp.text().then((text) => {
        const json = isJSON(text) ? JSON.parse(text) : {};
        // console.log(json);
        return Promise.resolve(json);
      });
    })
    .catch((err) => {
      return Promise.reject(err);
    });
  return Promise.race([
    fetchAPI,
    new Promise((resolve, reject) => {
      setTimeout(reject, 60000);
    }),
  ]);
};

const GET = (uri, body) => fetching(uri, "GET", body);
const POST = (uri, body) => fetching(uri, "POST", body);
const PATCH = (uri, body) => fetching(uri, "PATCH", body);
const PUT = (uri, body) => fetching(uri, "PUT", body);
const DELETE = (uri, body) => fetching(uri, "DELETE", body);

export default {
  GET,
  POST,
  PATCH,
  PUT,
  DELETE,
};
