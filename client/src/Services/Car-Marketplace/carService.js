import { api } from "../api";

const carService = {
    postAd: async (fields, images, features) => {
        const formData = new FormData();

        // Append all scalar fields
        Object.entries(fields).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                formData.append(key, value);
            }
        });

        // Features array must be JSON-stringified — FormData can't serialize arrays
        formData.append("features", JSON.stringify(features));

        // Append each File object under the key "images"
        images.forEach((img) => {
            formData.append("images", img.file);
        });

        return await api.post('/cars', formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },

    getMyAds: async () => {
        return await api.get('/cars/my-ads');
    },

    deleteAd: async (id) => {
        return await api.delete(`/cars/${id}`);
    },
    
    getCars: async (params = {}) => {
        return await api.get('/cars', { params });
    },

    getCarById: async (id) => {
        return await api.get(`/cars/${id}`);
    },

    getSimilarCars: async (make, excludeId) => {
        return await api.get('/cars', { params: { make, limit: 4 } })
            .then(res => ({
                ...res,
                data: {
                    ...res.data,
                    cars: res.data.cars.filter(c => c._id !== excludeId),
                }
            }));
    },
};

export default carService;