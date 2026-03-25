import { useMutation, useQueryClient } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const useAddMake = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: adminService.addMake,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['makes'] });
        },
    });
};
