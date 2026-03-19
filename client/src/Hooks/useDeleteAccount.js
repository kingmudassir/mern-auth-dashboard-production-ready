import { useMutation, useQueryClient } from '@tanstack/react-query';
import authService from '../Services/authService';

export const useDeleteAccount = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authService.deleteAccount,
        onSuccess: () => {
            queryClient.setQueryData(['user'], null);
        }
    });
};