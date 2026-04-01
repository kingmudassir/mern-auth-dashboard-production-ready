import { useQuery } from '@tanstack/react-query';
import carService from '../../Services/Car-Marketplace/carService';

export const useGetCarById = (id) => {
    return useQuery({
        queryKey: ['car', id],
        queryFn: () => carService.getCarById(id),
        enabled: !!id,
        staleTime: 60 * 1000,
        retry: false,
    });
};

export const useGetSimilarCars = (make, excludeId) => {
    return useQuery({
        queryKey: ['cars', 'similar', make],
        queryFn: () => carService.getSimilarCars(make, excludeId),
        enabled: !!make,
        staleTime: 60 * 1000,
        retry: false,
    });
};