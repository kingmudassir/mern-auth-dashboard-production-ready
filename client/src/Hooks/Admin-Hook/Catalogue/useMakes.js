import { useQuery } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const useMakes = () => {
    return useQuery({
        queryKey: ['makes'],
        queryFn: adminService.getMakes,
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
