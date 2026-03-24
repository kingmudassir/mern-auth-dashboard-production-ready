import { useMutation, useQueryClient } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const useSoftDeleteUser = (userId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => adminService.softDeleteUser({ userId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
            queryClient.invalidateQueries({ queryKey: ['adminStats'] });
        },
    });
};
