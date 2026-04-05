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

            // 1. UPDATE THE INDIVIDUAL CAR DETAIL CACHE (used by CarListing page)
            queryClient.setQueryData(['car', carId], (old) => {
                if (!old) return old;
                return { ...old, car: { ...old.car, isSaved } };
            });

            // 2. UPDATE ALL MARKETPLACE LIST CACHE ENTRIES
            // The marketplace uses ['cars', params] where params is the query object.
            // We don't know which params keys are active, so we walk every cache entry
            // whose key starts with 'cars' and patch the matching car in-place.
            queryClient.setQueriesData({ queryKey: ['cars'] }, (old) => {
                if (!old?.cars) return old;
                return {
                    ...old,
                    cars: old.cars.map((car) =>
                        (car._id ?? car.id) === carId ? { ...car, isSaved } : car
                    ),
                };
            });

            // 3. UPDATE THE SAVED ADS LIST CACHE (optimistic remove on unsave)
            queryClient.setQueryData(['saved-ads'], (old = []) => {
                if (!isSaved) {
                    return old.filter((car) => (car._id ?? car.id) !== carId);
                }
                return old;
            });

            // 4. SYNC: only invalidate the list, not the individual car cache
            // (server write might not be complete yet — invalidating ['car', carId]
            //  immediately can cause a rollback to the old isSaved value)
            queryClient.invalidateQueries({ queryKey: ['saved-ads'] });
        },
    });
};