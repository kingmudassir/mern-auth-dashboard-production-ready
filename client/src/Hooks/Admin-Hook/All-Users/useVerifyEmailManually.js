import { useMutation, useQueryClient } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const useVerifyEmailManually = (userId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => adminService.manuallyVerifyEmail({ userId }),
        onSuccess: (data) => {
            queryClient.setQueryData(['adminUser', userId], (old) => ({
                ...old,
                user: data.user
            }));
            queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
        }
    });
};