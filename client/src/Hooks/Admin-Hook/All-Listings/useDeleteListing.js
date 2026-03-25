import authService from "../../../Services/authService"
import { useMutation } from "@tanstack/react-query"

export const useDeleteListing = () => {
    return useMutation({
        mutationFn: authService.changePassword,
    })
}
