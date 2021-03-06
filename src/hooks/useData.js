import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';

/**
 * @function useData - custom hook for hitting an API endpoint
 * @param {Object} options
 * @param {String} options.endpoint - API endpoint
 * @param {String} options.method - HTTP method
 * @param {Object} options.headers - HTTP headers
 * @param {Object} options.payload - HTTP payload - used for POST requests
 * @param {Function} options.processData - function for processing data returned by the API
 */
function useData({ endpoint, method, headers = {}, payload = {}, processData }) {

  const [data, setData] = useState();

  // used for dependency arrays
  const [stringifiedEndpoint, stringifiedHeaders] = [endpoint, JSON.stringify(headers)];

  // If no processing function is passed just return the data
  // The callback hook ensures that the function is only created once
  // and hence the effect hook below doesn't start an infinite loop
  const processJson = useCallback(processData || ((jsonBody) => jsonBody), []);

  useEffect(() => {
    fetchApi().then(data => {
      setData(data);
    });
  }, [stringifiedEndpoint, stringifiedHeaders, processJson]);

  const generateRequestOptions = ({ endpoint, method, headers = {}, payload = {} }) => {
    let options = {
      url: process.env.REACT_APP_BASE_URL + endpoint,
      headers: headers,
      method: method
    };

    if (method == 'POST') {
      options.data = payload
    }

    return options;
  }

  const fetchApi = () => {
    let options = generateRequestOptions({ endpoint, method, headers, payload });
    console.log(options);

    return new Promise((resolve, reject) => {
      axios(options).then(response => {
        resolve(processJson(response.data));
      }).catch(error => {
        console.log(error);
        reject(error);
      });
    });
  };

  return [data];
};

export default useData;