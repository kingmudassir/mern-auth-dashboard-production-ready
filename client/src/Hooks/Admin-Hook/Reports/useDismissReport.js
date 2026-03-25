import { useMutation, useQueryClient } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const useDismissReport = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: adminService.dismissReport,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
        },
    });
};
