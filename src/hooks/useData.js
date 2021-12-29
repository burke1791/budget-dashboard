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
 * @param {Array} options.conditions - a list of conditions that must evaluate to true in order to make the api call
 */
function useData({ endpoint, method, headers = {}, payload = {}, processData, refreshTrigger, conditions = [] }) {

  const [data, setData] = useState();
  const [fetchDate, setFetchDate] = useState();
  const [isValid, setIsValid] = useState(false);

  // used for dependency arrays
  const [stringifiedEndpoint, stringifiedHeaders] = [endpoint, JSON.stringify(headers)];

  // If no processing function is passed just return the data
  // The callback hook ensures that the function is only created once
  // and hence the effect hook below doesn't start an infinite loop
  const processJson = useCallback(processData || ((jsonBody) => jsonBody), []);

  useEffect(() => {
    setIsValid(evaluateConditions());
  }, [...conditions]);

  useEffect(() => {
    if (isValid) {
      setData(null);
      fetchApi().then(data => {
        setData(data);
        setFetchDate(new Date());
      });
    }
  }, [stringifiedEndpoint, stringifiedHeaders, processJson, refreshTrigger, isValid]);

  const evaluateConditions = () => {
    if (conditions.length == 0) return true;

    for (let condition of conditions) {
      if (!condition) return false;
    }

    return true;
  }

  const generateRequestOptions = ({ endpoint, method, headers = {}, payload = {} }) => {
    let options = {
      url: `/${endpoint}`,
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

    return new Promise((resolve, reject) => {
      axios(options).then(response => {
        resolve(processJson(response.data));
      }).catch(error => {
        console.log(error);
        reject(error);
      });
    });
  };

  return [data, fetchDate];
};

export default useData;