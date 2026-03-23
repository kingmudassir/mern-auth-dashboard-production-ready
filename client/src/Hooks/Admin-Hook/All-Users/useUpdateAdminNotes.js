import { useMutation, useQueryClient } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const useUpdateAdminNotes = (userId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (notes) => adminService.updateAdminNotes({ userId, notes }),
        onSuccess: (data) => {
            queryClient.setQueryData(['adminUser', userId], (old) => ({
                ...old,
                user: { ...old.user, adminNotes: data.adminNotes }
            }));
        }
    });
};