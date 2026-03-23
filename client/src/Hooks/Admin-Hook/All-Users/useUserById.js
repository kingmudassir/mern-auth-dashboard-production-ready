import { useQuery } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const useUserById = (userId) => {
    return useQuery({
        queryKey: ['adminUser', userId],
        queryFn: () => adminService.getUserById(userId),
        enabled: !!userId,
        retry: false,
    });
};