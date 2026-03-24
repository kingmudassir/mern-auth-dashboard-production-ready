import { useQuery } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const useBannedUsers = () => {
    return useQuery({
        queryKey: ['bannedUsers'],
        queryFn: adminService.getBannedUsers,
        retry: false,
        staleTime: 60 * 1000,
    });
};
