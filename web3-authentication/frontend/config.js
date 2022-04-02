let API_ROOT_URL = "";
let INFURA_KEY = process.env.INFURA_KEY;
let isProduction = false;
let isDev = false;

const isBrowser = () => typeof window !== "undefined";

if (isBrowser()) {
  if ((window.location.href.indexOf("http://127.0.0.1") > -1) | (window.location.href.indexOf("http://localhost") > -1)) {
    API_ROOT_URL = "http://localhost:4000";
    isDev = true;
  } else if (window.location.href.indexOf("https://sb.your-frontend.com/") > -1) {
    API_ROOT_URL = "https://sb-api.your-api.com";
    isDev = true;
  } else {
    isProduction = true;
    API_ROOT_URL = "https://api.your-api.com";
  }
}

export default {
  isProduction,
  isDev,
  API_ROOT_URL: `${API_ROOT_URL}`,
  INFURA_KEY,
};
