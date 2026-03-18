import { useMutation, useQueryClient } from "@tanstack/react-query"
import authService from "../Services/authService"

export const useUpdateProfile = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: authService.updateProfile,

        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user"] })
        }
    })
}