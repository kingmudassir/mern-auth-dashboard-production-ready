import { useMutation, useQueryClient } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const useUpdateUserRole = (userId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (role) => adminService.updateUserRole({ userId, role }),
        onSuccess: (data) => {
            queryClient.setQueryData(['adminUser', userId], (old) => ({
                ...old,
                user: data.user
            }));
            queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
            queryClient.invalidateQueries({ queryKey: ['adminAccounts'] });
            queryClient.invalidateQueries({ queryKey: ['bannedUsers'] });
        }
    });
};