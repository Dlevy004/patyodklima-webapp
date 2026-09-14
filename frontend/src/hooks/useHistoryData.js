import { useEffect } from 'react';

import useFetch from '@/hooks/useFetch';


export default function useHistoryData(apiUrl, refreshTrigger) {
    const { data, isLoading, error, refetch } = useFetch(apiUrl);

    useEffect(() => {
        if (refreshTrigger > 0) {
            refetch();
        }
    }, [refreshTrigger, refetch]);

    return { data: data ?? [], isLoading, error, refetch };
}