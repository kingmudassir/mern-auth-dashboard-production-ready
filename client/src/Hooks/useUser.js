import { useQuery } from "@tanstack/react-query"
import authService from "../Services/authService"

export const useUser = () => {
    return useQuery({
        queryKey: ["user"],
        queryFn: authService.getUser,
        retry: false,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false
    })
} 