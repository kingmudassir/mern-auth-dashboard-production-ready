import { useMutation, useQueryClient } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const useFlagListing = () => {
    const queryClient = useQueryClient();

    return useMutation({
        // "Flag" in the admin panel = reject with a reason.
        // The old code pointed this at updateReportPriority (a Reports endpoint) — wrong.
        mutationFn: ({ listingId, reason = 'Flagged by admin for review' }) =>
            adminService.rejectListing({ listingId, rejectionReason: reason }),

        onMutate: async ({ listingId }) => {
            await queryClient.cancelQueries({ queryKey: ['allListings'] });
            const previous = queryClient.getQueryData(['allListings', {}]);

            queryClient.setQueryData(['allListings', {}], (old) => {
                if (!old?.listings) return old;
                return {
                    ...old,
                    listings: old.listings.map((l) =>
                        l._id === listingId ? { ...l, status: 'rejected' } : l
                    ),
                };
            });

            return { previous };
        },

        onError: (_err, _vars, context) => {
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