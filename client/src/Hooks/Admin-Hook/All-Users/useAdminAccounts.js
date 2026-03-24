import { useQuery } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const useAdminAccounts = () => {
    return useQuery({
        queryKey: ['adminAccounts'],
        queryFn: adminService.getAdminAccounts,
        retry: false,
        staleTime: 60 * 1000,
    });
};
