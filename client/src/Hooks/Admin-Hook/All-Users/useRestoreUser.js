import { useMutation, useQueryClient } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const useRestoreUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId) => adminService.restoreUser({ userId }),
        onSuccess: (_, userId) => {
            queryClient.invalidateQueries({ queryKey: ['deletedUsers'] });
            queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
            queryClient.invalidateQueries({ queryKey: ['adminStats'] });
            queryClient.removeQueries({ queryKey: ['adminUser', userId] });
        },
    });
};
