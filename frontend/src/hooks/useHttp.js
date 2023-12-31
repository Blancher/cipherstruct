import {useState} from 'react';

export default function useHttp() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendRequest = async(path, method = 'GET', body = null, headers = {}) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/${path}`, {method, body, headers});
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setIsLoading(false);
            return data;
        } catch(err) {
            setIsLoading(false);
            setError(err.message);
            throw err;
        }
    };

    return [isLoading, error, sendRequest];
}