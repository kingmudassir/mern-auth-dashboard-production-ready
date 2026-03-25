import authService from "../../../Services/authService"
import { useMutation } from "@tanstack/react-query"

export const useFlagListing = () => {
    return useMutation({
        mutationFn: authService.changePassword,
    })
}
