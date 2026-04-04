import { useQuery } from "@tanstack/react-query";
import { api } from "../../Services/api";

export function useVariants(make, model, year) {
    const enabled = Boolean(make && model && year && make !== "Other" && model !== "Other");

    return useQuery({
        queryKey: ["variants", make, model, year],
        queryFn: () =>
            api.get("/master/variants", {
                params: { make, model, year },
            }),
        enabled,
        staleTime: 10 * 60 * 1000, // 10 min — variant data rarely changes
        retry: false,
        select: (data) => data?.variants ?? [],
    });
}