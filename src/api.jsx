import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.88.17:8080/api",  
    //baseURL: "https://api.hlopg.com/api",  

  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(
      `📤 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
    );
    console.log("📦 Request data:", config.data);
    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
  );

  // Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response ${response.status}:`, response.data);
    return response;
  },
  (error) => {
    console.error("❌ API ERROR:");
    console.error("   Status:", error.response?.status);
    console.error("   Data:", error.response?.data);
    console.error("   Message:", error.message);

    const apiError = {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      data: error.response?.data,
      code: error.code,
    };

    return Promise.reject(apiError);
  }
);

export default api;
