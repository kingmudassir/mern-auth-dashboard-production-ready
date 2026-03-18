import { useMutation } from "@tanstack/react-query"
import authService from "../Services/authService"
import { useNavigate } from "react-router-dom"

export const useResetPassword = (setPasswordMessage) => {
    const navigate = useNavigate()

    return useMutation({
        mutationFn: authService.resetPassword,
    })
}