import axios from 'axios';
import { useCallback, useState } from 'react';

function useApi({ endpoint, method, headers }) {
  const [res, setRes] = useState();
  const [returnDate, setReturnDate] = useState(null);

  const callApi = useCallback((payload) => {
    setRes(prevState => ({ ...prevState, isLoading: true }));
    const options = {
      url: endpoint,
      headers: headers,
      method: method
    };

    if (method == 'POST') {
      options.data = payload;
    }

    axios(options).then(response => {
      setRes({ data: response.data, isLoading: false, error: null });
      setReturnDate(new Date());
    }).catch(error => {
      setRes({ data: null, isLoading: false, error });
      setReturnDate(new Date());
    });
  }, [endpoint, JSON.stringify(headers)]);

  return [res, returnDate, callApi]
}

export default useApi;