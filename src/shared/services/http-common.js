// http-common.js
import axios from "axios";
import { authenticationInterceptor } from "../../ElixirLine/security/services/authentication.interceptor.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const http = axios.create({ baseURL: API_BASE_URL });

// Sólo JSON cuando el data NO sea FormData
http.interceptors.request.use(config => {
    // Si vamos a enviar FormData, borramos el Content-Type
    if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
    } else {
        config.headers["Content-Type"] = "application/json";
    }
    return authenticationInterceptor(config);
});

export default http;






/*
import axios from "axios";
import {authenticationInterceptor} from "../../ElixirLine/security/services/authentication.interceptor.js";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
*/
/**
 * Axios instance
 * @summary
 * Axios instance to make HTTP requests to the backend API
 * @type {axios.AxiosInstance}
 */

/*
const http = axios.create({
    baseURL: API_BASE_URL
});

http.defaults.headers.common["Content-Type"] = "application/json";
http.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

// Add a request interceptor
http.interceptors.request.use(authenticationInterceptor);

export default http;

*/
