import { useQuery } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const useCityById = (cityId) => {
    return useQuery({
        queryKey: ['city', cityId],
        queryFn: () => adminService.getCityById(cityId),
        enabled: !!cityId,
        retry: false,
    });
};
