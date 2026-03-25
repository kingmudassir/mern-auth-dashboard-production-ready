import { useMutation, useQueryClient } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const useDeleteMake = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: adminService.deleteMake,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['makes'] });
        },
    });
};
