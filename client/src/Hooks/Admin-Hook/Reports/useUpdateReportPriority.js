import { useMutation, useQueryClient } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const useUpdateReportPriority = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: adminService.updateReportPriority,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
        },
    });
};
