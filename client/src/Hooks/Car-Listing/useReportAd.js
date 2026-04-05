// ─────────────────────────────────────────────────────────────────
// FILE: Hooks/Car-Listing/useReportAd.js
// ─────────────────────────────────────────────────────────────────
import { useMutation, useQueryClient } from '@tanstack/react-query';
import carService from '../../Services/Car-Marketplace/carService';

export const useReportAd = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ carId, reason, description }) =>
            carService.reportAd({ carId, reason, description }),

        onSuccess: (_data, { carId }) => {
            // 1. Invalidate admin reports list so the new report appears immediately
            //    in the ReportsPanel without a manual refresh.
            queryClient.invalidateQueries({ queryKey: ['reports'] });

            // 2. Invalidate this specific car so if the threshold was crossed and
            //    the backend flipped status → "pending", the detail page reflects it.
            queryClient.invalidateQueries({ queryKey: ['car', carId] });
        },
    });
};