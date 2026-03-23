import { useMutation, useQueryClient } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const useUpdateUserInfo = (userId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (fields) => adminService.updateUserInfo({ userId, ...fields }),
        onSuccess: (data) => {
            queryClient.setQueryData(['adminUser', userId], (old) => ({
                ...old,
                user: data.user
            }));
        }
    });
};