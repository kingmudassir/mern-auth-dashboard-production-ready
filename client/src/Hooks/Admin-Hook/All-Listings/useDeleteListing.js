import { useMutation, useQueryClient } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const useDeleteListing = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: adminService.removeFlaggedListing, // receives listingId directly

        onMutate: async (listingId) => {
            await queryClient.cancelQueries({ queryKey: ['allListings'] });
            const previous = queryClient.getQueryData(['allListings', {}]);

            queryClient.setQueryData(['allListings', {}], (old) => {
                if (!old?.listings) return old;
                return {
                    ...old,
                    listings: old.listings.filter((l) => l._id !== listingId),
                    total: (old.total ?? 1) - 1,
                };
            });

            return { previous };
        },

        onError: (_err, _id, context) => {
            if (context?.previous) {
                queryClient.setQueryData(['allListings', {}], context.previous);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['allListings'] });
            queryClient.invalidateQueries({ queryKey: ['flaggedListings'] });
        },
    });
};