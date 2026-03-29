import { useMutation, useQueryClient } from '@tanstack/react-query';
import adminService from '../../../Services/adminService';

// export const useUpdateUserStatus = (userId) => {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: ({ status, banReason }) =>
//             adminService.updateUserStatus({ userId, status, banReason }),

//         onSuccess: (data) => {
//             queryClient.setQueryData(['adminUser', userId], (old) => ({
//                 ...old,
//                 user: data.user
//             }));
//             queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
//             queryClient.invalidateQueries({ queryKey: ['bannedUsers'] });
//             queryClient.invalidateQueries({ queryKey: ['adminStats'] });
//         }
//     });
// };

export const useUpdateUserStatus = () => { // Remove userId from here
    const queryClient = useQueryClient();

    return useMutation({
        // Extract userId from the object passed to mutate()
        mutationFn: ({ userId, status, banReason }) => 
            adminService.updateUserStatus({ userId, status, banReason }),

        onSuccess: (data, variables) => {
            // Use variables.userId to update the specific cache entry
            queryClient.setQueryData(['adminUser', variables.userId], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    user: data.user
                };
            });
            
            // Invalidate the lists to refresh the table
            queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
            queryClient.invalidateQueries({ queryKey: ['allUsers'] }); // Make sure this matches your useAllUsers key
            queryClient.invalidateQueries({ queryKey: ['adminStats'] });
        }
    });
};