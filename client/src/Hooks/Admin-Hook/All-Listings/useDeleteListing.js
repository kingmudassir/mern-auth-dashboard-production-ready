import { useMutation, useQueryClient } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const useDeleteListing = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: adminService.removeFlaggedListing,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allListings'] });
            queryClient.invalidateQueries({ queryKey: ['flaggedListings'] });
        },
    });
}
