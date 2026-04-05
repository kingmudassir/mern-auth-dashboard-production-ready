// FILE: Hooks/Saved-Ads/useToggleSave.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import carService from '../../Services/Car-Marketplace/carService';

export const useToggleSave = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (carId) => carService.toggleSave(carId),
        onSuccess: (response, carId) => {
            const data = response?.data ?? response;
            const isSaved = data?.saved;

            // 1. UPDATE THE INDIVIDUAL CAR CACHE
            // This is what the Listing page uses. We update it manually so it stays 
            // set to the new value without waiting for a refetch.
            queryClient.setQueryData(['car', carId], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    car: {
                        ...old.car,
                        isSaved: isSaved,
                    },
                };
            });

            // 2. UPDATE THE SAVED ADS LIST CACHE
            queryClient.setQueryData(['saved-ads'], (old = []) => {
                if (!isSaved) {
                    // Remove it immediately for an instant "unsave" response
                    return old.filter((car) => (car._id ?? car.id) !== carId);
                }
                return old;
            });

            // 3. SYNC STRATEGY
            // ONLY invalidate the list. Do NOT invalidate ['car', carId] immediately, 
            // as the server might not have finished the write-operation, 
            // causing a "rollback" to the old data.
            queryClient.invalidateQueries({ queryKey: ['saved-ads'] });
        },
    });
};