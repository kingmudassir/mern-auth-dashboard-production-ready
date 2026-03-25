import { useMutation, useQueryClient } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const useFlagListing = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ listingId, reason }) => adminService.updateReportPriority({ reportId: listingId, priority: 'high' }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allListings'] });
            queryClient.invalidateQueries({ queryKey: ['flaggedListings'] });
        },
    });
}
