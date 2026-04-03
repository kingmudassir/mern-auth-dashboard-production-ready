import { useMutation, useQueryClient } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const useApproveListing = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: adminService.approveListing,

        onMutate: async (listingId) => {
            await queryClient.cancelQueries({ queryKey: ['allListings'] });
            const previous = queryClient.getQueryData(['allListings', {}]);

            queryClient.setQueryData(['allListings', {}], (old) => {
                if (!old?.listings) return old;
                return {
                    ...old,
                    listings: old.listings.map((l) =>
                        l._id === listingId ? { ...l, status: 'active' } : l
                    ),
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
            queryClient.invalidateQueries({ queryKey: ['pendingListings'] });
        },
    });
};