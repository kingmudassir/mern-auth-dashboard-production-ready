import { useMutation, useQueryClient } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const useChangeRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, role }) => adminService.updateUserRole({ userId, role }),
        onSuccess: (_, { userId }) => {
            queryClient.invalidateQueries({ queryKey: ['adminAccounts'] });
            queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
            queryClient.invalidateQueries({ queryKey: ['adminUser', userId] });
            queryClient.invalidateQueries({ queryKey: ['bannedUsers'] });
        },
    });
};
