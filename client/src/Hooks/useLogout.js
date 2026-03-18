import { useMutation, useQueryClient } from "@tanstack/react-query"
import authService from "../Services/authService"

export const useLogout = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: authService.logout,

        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user"] })
        }
    })
}