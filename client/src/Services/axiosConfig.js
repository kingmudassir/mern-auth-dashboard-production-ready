import axios from "axios"

const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api/v2",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
})

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.data) {
            return Promise.reject(error.response.data)
        }

        return Promise.reject({
            message: "Frontend server error default message.",
        })
    }
)

export default axiosInstance