import { useMutation } from "@tanstack/react-query";
import authService from "../Services/authService";

export const useResendOTP = (setSuccessMsg) => {
    return useMutation ({
        mutationFn: authService.resendOTP,

        onSuccess: (data) => {
            if (setSuccessMsg) setSuccessMsg(data.message);
        }
    })
}