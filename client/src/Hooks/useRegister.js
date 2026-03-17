import { useMutation } from "@tanstack/react-query";
import authService from "../Services/authService";
import { useNavigate } from "react-router-dom";

export const useRegister = () => {
    const navigate = useNavigate()

    return useMutation({
        mutationFn: authService.register,

        onSuccess: (_, variables) => {
            navigate("/verifyotp", { state: { contact: variables.email, type: 'email' } });
        }
    })
}
