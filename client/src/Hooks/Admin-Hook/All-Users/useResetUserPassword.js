import { useMutation } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const useResetUserPassword = (userId) => {
    return useMutation({
        mutationFn: ({ newPassword }) => adminService.resetUserPassword({ userId, newPassword }),
    });
};
