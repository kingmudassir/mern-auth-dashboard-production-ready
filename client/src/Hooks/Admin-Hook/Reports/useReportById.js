import { useQuery } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const useReportById = (reportId) => {
    return useQuery({
        queryKey: ['report', reportId],
        queryFn: () => adminService.getReportById(reportId),
        enabled: !!reportId,
        retry: false,
    });
};
