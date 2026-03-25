import { useMutation, useQueryClient } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const useAddCity = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: adminService.addCity,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cities'] });
        },
    });
};
