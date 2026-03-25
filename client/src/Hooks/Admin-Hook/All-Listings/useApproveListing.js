import { useMutation, useQueryClient } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const useApproveListing = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: adminService.approveListing,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allListings'] });
            queryClient.invalidateQueries({ queryKey: ['pendingListings'] });
        },
    });
}
