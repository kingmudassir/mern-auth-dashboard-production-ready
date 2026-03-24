import { useMutation, useQueryClient } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const useUnbanUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId) => adminService.updateUserStatus({ userId, status: 'active' }),
        onSuccess: (_, userId) => {
            queryClient.invalidateQueries({ queryKey: ['bannedUsers'] });
            queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
            queryClient.invalidateQueries({ queryKey: ['adminStats'] });
            queryClient.removeQueries({ queryKey: ['adminUser', userId] });
        },
    });
};
