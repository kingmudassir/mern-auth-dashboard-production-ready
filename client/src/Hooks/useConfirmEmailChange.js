import { useQuery } from '@tanstack/react-query';
import authService from '../Services/authService';

export const useConfirmEmailChange = (token) => {
    return useQuery({
        queryKey: ['confirmEmailChange', token],
        queryFn: () => authService.confirmEmailChange(token),
        enabled: !!token,        // only runs if token exists
        retry: false,            // don't retry on failure — token is either valid or not
        staleTime: Infinity,     // never refetch this
    });
};