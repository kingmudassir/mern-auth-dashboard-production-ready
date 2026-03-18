import { useMutation, useQueryClient } from "@tanstack/react-query"
import authService from "../Services/authService"

export const useEmailChange = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: authService.requestEmailChange,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] })
        }
    })
}