import { useQuery } from '@tanstack/react-query';
import carService from '../../Services/Car-Marketplace/carService';

export const useGetCars = (filters = {}) => {
    return useQuery({
        queryKey: ['cars', filters],
        queryFn: () => carService.getCars(filters),
        keepPreviousData: true,   // no flash between pages
        staleTime: 30 * 1000,
        retry: false,
    });
};