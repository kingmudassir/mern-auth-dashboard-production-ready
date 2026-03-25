import { useMutation, useQueryClient } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const useUpdateCity = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: adminService.updateCity,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['cities'] });
            queryClient.invalidateQueries({ queryKey: ['city', variables.cityId] });
        },
    });
};
