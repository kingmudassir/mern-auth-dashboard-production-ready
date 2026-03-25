import { useMutation, useQueryClient } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const useDeleteCity = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: adminService.deleteCity,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cities'] });
        },
    });
};
