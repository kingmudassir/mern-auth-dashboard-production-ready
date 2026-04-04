import { useQuery } from '@tanstack/react-query';
import carService from '../../Services/Car-Marketplace/carService';

// useMyAds.js
const useMyAds = () => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['myAds'],
        queryFn: carService.getMyAds, // Now returns the actual array [...]
        retry: false,
    });

    return {
        // 'data' here is the array returned by the service
        ads: data || [], 
        isLoading,
        isError,
        error,
    };
};

export default useMyAds;