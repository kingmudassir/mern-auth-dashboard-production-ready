import { useMutation, useQueryClient } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const useAddModelToMake = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: adminService.addModelToMake,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['makes'] });
            queryClient.invalidateQueries({ queryKey: ['make', variables.makeId] });
        },
    });
};
