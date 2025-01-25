// import axios from "axios";
// import { getToken } from "./helper/GetToken";


// const apiurl = axios.create({
//   baseURL: import.meta.env.VITE_APP_DEV_BASE_URL,
// });

// apiurl.interceptors.request.use(
//   (config) => {
//     const tokenId = getToken(); 
//     console.log(tokenId);
//     if (tokenId) {
//       config.headers.Authorization = `Bearer ${tokenId}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default apiurl;



import axios from "axios";

const apiurl = axios.create({
  baseURL: import.meta.env.VITE_APP_DEV_BASE_URL,
  // baseURL: "https://server.360carprotect.in/api/v1"

});

export default apiurl;
