import { useMutation, useQueryClient } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const useDeleteAdminUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId) => adminService.softDeleteUser({ userId }),
        onSuccess: (_, userId) => {
            queryClient.invalidateQueries({ queryKey: ['adminAccounts'] });
            queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
            queryClient.invalidateQueries({ queryKey: ['adminUser', userId] });
            queryClient.invalidateQueries({ queryKey: ['deletedUsers'] });
        },
    });
};
