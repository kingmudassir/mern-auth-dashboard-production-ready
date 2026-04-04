import { useMutation, useQueryClient } from '@tanstack/react-query';
import carService from '../../Services/Car-Marketplace/carService';

const usePatchAd = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: carService.patchMyAdStatus, // receives { adId, status }

        onMutate: async ({ adId, status }) => {
            await queryClient.cancelQueries({ queryKey: ['myAds'] });
            const previous = queryClient.getQueryData(['myAds']);
            queryClient.setQueryData(['myAds'], (old) => {
                // 'old' is now the array returned by getMyAds
                if (!old) return []; 
                return old.filter((ad) => ad._id !== adId); 
            });
            return { previous };
        },

        onError: (_err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(['myAds'], context.previous);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['myAds'] });
        },
    });
};

export default usePatchAd;