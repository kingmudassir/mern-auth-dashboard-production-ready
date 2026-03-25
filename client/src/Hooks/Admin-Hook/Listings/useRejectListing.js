import { useMutation, useQueryClient } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const useRejectListing = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: adminService.rejectListing,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pendingListings'] });
            queryClient.invalidateQueries({ queryKey: ['adminListings'] });
        },
    });
};
