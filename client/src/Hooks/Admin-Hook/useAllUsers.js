import { useQuery } from '@tanstack/react-query';
import adminService from '../../Services/adminService';

export const useAllUsers = () => {
    return useQuery({
        queryKey: ['adminUsers'],
        queryFn: adminService.getAllUsers,
        retry: false,
        staleTime: 60 * 1000,
    });
};