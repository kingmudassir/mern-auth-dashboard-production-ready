import { useMutation, useQueryClient } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const useBanAdminUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, ban }) =>
            adminService.updateUserStatus({
                userId,
                status: ban ? 'banned' : 'active',
            }),
        onSuccess: (_, { userId }) => {
            queryClient.invalidateQueries({ queryKey: ['adminAccounts'] });
            queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
            queryClient.invalidateQueries({ queryKey: ['bannedUsers'] });
            queryClient.invalidateQueries({ queryKey: ['adminUser', userId] });
        },
    });
};
