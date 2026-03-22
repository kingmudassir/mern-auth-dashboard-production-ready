import { useQuery } from '@tanstack/react-query';
import adminService from '../../Services/adminService';

export const useAdminStats = () => {
    return useQuery({
        queryKey: ['adminStats'],
        queryFn: adminService.getAdminStats,
        retry: false,
        staleTime: 60 * 1000,
    });
};