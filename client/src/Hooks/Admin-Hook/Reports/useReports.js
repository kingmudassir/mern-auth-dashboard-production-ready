import { useQuery } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const useReports = (filters = {}) => {
    return useQuery({
        queryKey: ['reports', filters],
        queryFn: () => adminService.getReports(filters),
        retry: false,
        staleTime: 30 * 1000,
    });
};
