import { useQuery } from '@tanstack/react-query';
import carService from '../../Services/Car-Marketplace/carService';

const useMyAds = () => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['myAds'],
        queryFn: carService.getMyAds,
        retry: false,
        staleTime: 2 * 60 * 1000,
    });

    return {
        ads: data?.listings ?? [],
        isLoading,
        isError,
        error,
    };
};

export default useMyAds;