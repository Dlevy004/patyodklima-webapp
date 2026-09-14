import useFetch from '@/hooks/useFetch';

export default function useHistoryData(apiUrl) {
    const { data, isLoading, error, refetch } = useFetch(apiUrl);
    return { data: data ?? [], isLoading, error, refetch };
}