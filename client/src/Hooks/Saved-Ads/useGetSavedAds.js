// ─────────────────────────────────────────────────────────────────
// FILE: Hooks/Saved-Ads/useGetSavedAds.js
// ─────────────────────────────────────────────────────────────────
import { useQuery } from '@tanstack/react-query';

import carService from '../../Services/Car-Marketplace/carService';
import { useUser } from '../useUser';

export const useGetSavedAds = () => {
    const { data: user } = useUser();

    return useQuery({
        queryKey: ['saved-ads'],
        queryFn: () => carService.getSavedAds(),
        enabled: !!user,          // only fetch when logged in
        staleTime: 30 * 1000,
        retry: false,
    });
};