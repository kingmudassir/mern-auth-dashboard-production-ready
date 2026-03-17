import axiosInstance from "./axiosConfig"

export const api = {
    get: async (url, config = {}) => {
        // console.log("API.js: GET route hit");
        const response = await axiosInstance.get(url, config)
        return response.data
    },

    post: async (url, data, config = {}) => {
        // console.log("API.js: POST route hit");
        console.log("Hit (2)")
        const response = await axiosInstance.post(url, data, config)
        return response.data
    },

    put: async (url, data, config = {}) => {
        // console.log("API.js: PUT route hit");
        const response = await axiosInstance.put(url, data, config)
        return response.data
    },

    delete: async (url, config = {}) => {
        // console.log("API.js: DELETE route hit");
        const response = await axiosInstance.delete(url, config)
        return response.data
    }
}