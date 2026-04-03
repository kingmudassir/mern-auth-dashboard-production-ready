import { useQuery } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const useAllListings = (filters = {}) => {
    return useQuery({
        queryKey: ['allListings', filters],
        queryFn: () => adminService.getAllListings(filters),
        retry: false,
        staleTime: 30 * 1000,
    });
};