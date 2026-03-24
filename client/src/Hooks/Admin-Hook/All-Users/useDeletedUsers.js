import { useQuery } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const useDeletedUsers = () => {
    return useQuery({
        queryKey: ['deletedUsers'],
        queryFn: adminService.getDeletedUsers,
        retry: false,
        staleTime: 60 * 1000,
    });
};
