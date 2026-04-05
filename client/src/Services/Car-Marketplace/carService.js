import { api } from "../api";

const carService = {
    postAd: async (fields, images, features) => {
        const formData = new FormData();

        // 1. Append scalar fields (strings/numbers)
        Object.entries(fields).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                formData.append(key, value);
            }
        });

        // 2. Features must be stringified for Multer to handle via FormData
        formData.append("features", JSON.stringify(features || []));

        // 3. Append images. Note: controller expects 'images' key
        if (Array.isArray(images)) {
            images.forEach((img) => {
                // Ensure we are sending the actual File object
                const fileToUpload = img.file || img; 
                formData.append("images", fileToUpload);
            });
        }

        return await api.post('/cars', formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },

    // carService.js
    getMyAds: async () => {
        const data = await api.get('/cars/my-ads');
        
        // DEBUG: This should show the object with 'ads' directly
        console.log("Service Data:", data); 

        // FIX: Access 'ads' directly from the returned object
        return data.ads || []; 
    },

    deleteMyAd: async (adId) => {
        return await api.delete(`/cars/${adId}`);
    },

    getCars: async (params = {}) => {
        return await api.get('/cars', { params });
    },

    getCarById: async (id) => {
        return await api.get(`/cars/${id}`);
    },

    getSimilarCars: async (make, excludeId) => {
        // Fetch 5 to ensure you can show 4 after filtering out the current car
        const data = await api.get('/cars', { params: { make, limit: 5 } });
        
        return {
            ...data,
            cars: (data.cars || []).filter(c => c._id !== excludeId).slice(0, 4),
        };
    },

    updateAdStatus: async (adId, status) => {
        return await api.patch(`/cars/${adId}/status`, { status });
    },

    getAdById: async (id) => {
        const response = await api.get(`/cars/my-ads/${id}`);
        return response.data || response; 
    },

    // Update ad (Handles JSON or FormData if you're uploading new images)
    updateAd: async (id, payload) => {
        const formData = new FormData();

        // 1. Append basic fields
        Object.entries(payload).forEach(([key, value]) => {
            // Skip specialized fields
            if (!["features", "images", "existingImages"].includes(key)) {
                if (value !== undefined && value !== null) {
                    formData.append(key, value);
                }
            }
        });

        // 2. Handle Features
        if (payload.features) {
            formData.append("features", JSON.stringify(payload.features));
        }

        // 3. Handle Existing Images (The list of URLs to keep)
        if (payload.existingImages) {
            formData.append("existingImages", JSON.stringify(payload.existingImages));
        }

        // 4. FIX: Flatten and Append New Files
        if (payload.images) {
            // .flat(Infinity) solves the [[[[File]]]] nesting issue
            const flatImages = Array.isArray(payload.images) ? payload.images.flat(Infinity) : [];
            
            flatImages.forEach((img) => {
                // Extract the raw File object
                const fileToUpload = img instanceof File ? img : img.file;
                
                if (fileToUpload instanceof File) {
                    formData.append("images", fileToUpload);
                }
            });
        }

        // 5. Submit as Multipart
        const response = await api.patch(`/cars/update/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        
        return response.data;
    },

    toggleSave: async (carId) => {
        return await api.post(`/cars/${carId}/save`);
    },

    getSavedAds: async () => {
        const data = await api.get('/cars/saved');
        return data.ads || [];
    },

    reportAd: async ({ carId, reason, description }) => {
        return await api.post(`/cars/${carId}/report`, { reason, description });
    },
};

export default carService;