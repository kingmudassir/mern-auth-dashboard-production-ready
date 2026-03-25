import authService from "../../../Services/authService"
import { useMutation } from "@tanstack/react-query"

export const useAllListings = () => {
    return useMutation({
        mutationFn: authService.changePassword,
    })
}
