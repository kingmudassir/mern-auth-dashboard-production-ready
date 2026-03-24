import { useMutation } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

export const useSendUserPasswordResetLink = (userId) => {
    return useMutation({
        mutationFn: () => adminService.sendUserPasswordResetLink({ userId }),
    });
};
