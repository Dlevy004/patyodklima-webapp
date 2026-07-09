import { useState, useEffect } from 'react';


function useFetch(url) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const refetch = () => {
        setRefreshKey(prevKey => prevKey + 1);
    };

    useEffect(() => {
        const controller = new AbortController();
        setIsLoading(true);
        setError(null);
        setData(null);

        const fetchData = async () => {
            try {
                const response = await fetch(url, {
                    signal: controller.signal
                });

                if (!response.ok) {
                    throw new Error('Failed to retrieve data from the server.');
                }

                const result = await response.json();
                setData(result);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    setError(error.message)
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

        return () => controller.abort();
    }, [url, refreshKey]);

    return { data, isLoading, error, refetch };
}

export default useFetch;