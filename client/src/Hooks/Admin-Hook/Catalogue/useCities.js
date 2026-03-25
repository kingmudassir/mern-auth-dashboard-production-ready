import { useQuery } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const useCities = () => {
    return useQuery({
        queryKey: ['cities'],
        queryFn: adminService.getCities,
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
