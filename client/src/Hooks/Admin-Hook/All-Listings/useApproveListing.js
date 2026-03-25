import { useMutation } from "@tanstack/react-query"
import authService from "../../../Services/authService"

export const useApproveListing = () => {
    return useMutation({
        mutationFn: authService.changePassword,
    })
}
