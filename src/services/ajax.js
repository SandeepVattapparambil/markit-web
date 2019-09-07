/**
 * Ajax Library - Wrapper
 */

/**
 * Import Axios library
 */
import axios from "axios";

/**
 * Import axios configuration object
 */
import axiosConfig from "../config/axiosConfig";

/**
 * @class Ajax
 * Ajax class
 */
class Ajax {
  /**
   * initialize the data and attributes
   */
  constructor(options) {
    /**
     * Options for axios
     */
    this.options = options || axiosConfig || {};

    /**
     * Initialize the axios instance
     */
    this.http = axios.create(this.options);
  }

  /**
   * @name makeRequest
   * @inner
   * Make a request with the options and parameters provided.
   * @param {String} url - The url string
   * @param {String} method - The HTTP method
   * @param {Object} queryParameters - The query parameters
   * @param {Object} body - The request body
   */
  makeRequest = (url, method, queryParameters, body) => {
    this.url = url
      ? url
      : (() => {
          throw new Error("URL required");
        })();
    this.queryParameters = queryParameters || {};
    this.body = body || {};
    this.method = method || "get";

    /**
     * Make the request
     */
    let request = this.http({
      method: this.method,
      url: this.url,
      params: this.queryParameters,
      data: this.body
    });
    return request;
  };

  /**
   * @name fetchUrl
   * @inner
   * Fetch a url with the options and parameters provided.
   * @param {String} url - The url string
   * @param {String} method - The HTTP method
   * @param {Object} queryParameters - The query parameters
   * @param {Object} body - The request body
   */
  fetchUrl = (url, method, queryParameters, body) => {
    return this.makeRequest(
      url,
      method.toLowerCase(),
      (queryParameters = queryParameters ? queryParameters : ""),
      (body = body ? body : "")
    )
      .then(function(res) {
        return res.data;
      })
      .catch(function(err) {
        return Promise.reject(err);
      });
  };
}

export default Ajax;
