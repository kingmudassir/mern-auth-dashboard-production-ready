import { useMutation, useQueryClient } from '@tanstack/react-query';
import carService from '../../Services/Car-Marketplace/carService';

export const useUpdateAd = (adId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload) => carService.updateAd(adId, payload),
        
        onSuccess: (updatedData) => {
            // 1. Refresh the list (Correct)
            queryClient.invalidateQueries({ queryKey: ['myAds'] });

            // 2. Refresh the specific ad detail
            // This forces useAdDetail to re-fetch the latest data from the server
            queryClient.invalidateQueries({ queryKey: ['ad', adId] });
            
            // ONLY use setQueryData if updatedData is the FULL car object
            // queryClient.setQueryData(['ad', adId], updatedData); 
        },
        
        onError: (error) => {
        console.error("Update failed:", error.response?.data || error.message);
        }
    });
};