import { useMutation } from "@tanstack/react-query";
import carService from "../../Services/carService";

export function usePostAd({ onSuccess, onError } = {}) {
    return useMutation({
        mutationFn: ({ fields, images, features }) => carService.postAd(fields, images, features),

        onSuccess: (data) => {
            onSuccess?.(data);
        },

        onError: (error) => {
            const message =
                error?.response?.data?.message ||
                "Something went wrong. Please try again.";
            onError?.(message);
        },
    });
}