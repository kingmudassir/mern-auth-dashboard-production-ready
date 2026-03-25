import { useQuery } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const useFlaggedListings = (filters = {}) => {
    return useQuery({
        queryKey: ['flaggedListings', filters],
        queryFn: () => adminService.getFlaggedListings(filters),
        retry: false,
        staleTime: 30 * 1000,
    });
};
