// src/utils/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
	baseURL: "http://127.0.0.1:8000",
});

axiosInstance.interceptors.request.use(
	config => {
		const access_token = localStorage.getItem("access_token");
		if (access_token) {
			config.headers.Authorization = `Bearer ${access_token}`;
		}
		return config;
	},
	error => {
		return Promise.reject(error);
	}
);

axiosInstance.interceptors.response.use(
	response => {
		return response;
	},
	async error => {
		const originalRequest = error.config;

		if (error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			const refresh_token = localStorage.getItem("refresh_token");

			if (refresh_token) {
				try {
					const response = await axios.post(
						"/refresh-token",
						{},
						{
							headers: {
								Authorization: `Bearer ${refresh_token}`,
							},
						}
					);
					const new_access_token = response.data.access_token;
					localStorage.setItem("access_token", new_access_token);
					originalRequest.headers.Authorization = `Bearer ${new_access_token}`;
					return axiosInstance(originalRequest);
				} catch (refreshError) {
					localStorage.removeItem("access_token");
					localStorage.removeItem("refresh_token");
					window.location.href = "/login";
				}
			} else {
				localStorage.removeItem("access_token");
				window.location.href = "/login";
			}
		}
		return Promise.reject(error);
	}
);

export default axiosInstance;
