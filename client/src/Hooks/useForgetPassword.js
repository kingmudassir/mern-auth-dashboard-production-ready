import { useMutation } from "@tanstack/react-query"
import authService from "../Services/authService"

export const useForgetPassword = (setPasswordMessage) => {

    return useMutation({
        mutationFn: authService.forgotPassword,
    })
}