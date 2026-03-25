import { useMutation, useQueryClient } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const useUpdateMake = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: adminService.updateMake,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['makes'] });
            queryClient.invalidateQueries({ queryKey: ['make', variables.makeId] });
        },
    });
};
