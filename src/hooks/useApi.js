import axios from 'axios';
import { useCallback, useState } from 'react';

function useApi({ endpoint, method, headers }) {
  const [res, setRes] = useState();
  const [returnDate, setReturnDate] = useState(null);

  const callApi = useCallback((payload) => {
    setRes(prevState => ({ ...prevState, isLoading: true }));
    const options = {
      url: process.env.REACT_APP_BASE_URL + endpoint,
      headers: headers,
      method: method
    };

    if (method == 'POST') {
      options.data = payload;
    }

    axios(options).then(response => {
      setRes({ data: res.data, isLoading: false, error: null });
    }).catch(error => {
      setRes({ data: null, isLoading: false, error });
    });
  }, [endpoint, JSON.stringify(headers)]);

  return [res, returnDate, callApi]
}

export default useApi;