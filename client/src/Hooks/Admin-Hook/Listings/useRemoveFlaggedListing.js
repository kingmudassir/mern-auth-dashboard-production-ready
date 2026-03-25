import { useMutation, useQueryClient } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const useRemoveFlaggedListing = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: adminService.removeFlaggedListing,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['flaggedListings'] });
            queryClient.invalidateQueries({ queryKey: ['adminListings'] });
        },
    });
};
