import { useMutation, useQueryClient } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const useUpdateUserStatus = (userId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ status, banReason }) =>
            adminService.updateUserStatus({ userId, status, banReason }),

        onSuccess: (data) => {
            queryClient.setQueryData(['adminUser', userId], (old) => ({
                ...old,
                user: data.user
            }));
            queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
        }
    });
};