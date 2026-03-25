import { useQuery } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const useMakeById = (makeId) => {
    return useQuery({
        queryKey: ['make', makeId],
        queryFn: () => adminService.getMakeById(makeId),
        enabled: !!makeId,
        retry: false,
    });
};
