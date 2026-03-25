import { useMutation, useQueryClient } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const useResolveReport = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: adminService.resolveReport,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
        },
    });
};
