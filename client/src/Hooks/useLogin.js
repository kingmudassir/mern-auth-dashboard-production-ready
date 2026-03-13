import { useMutation, useQueryClient } from "@tanstack/react-query"
import authService from "../Services/authService"

export const useLogin = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: authService.login,

        onSuccess: () => {
        // refetch user after login
        queryClient.invalidateQueries({ queryKey: ["user"] })
        }
    })
}