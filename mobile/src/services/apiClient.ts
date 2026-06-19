import axios from 'axios';

// Base client - ready to be updated with production API gateway URL
const apiClient = axios.create({
  baseURL: 'https://api.metrolinea-smart.gov.co/v1', // Placeholder production API
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor (e.g. for attaching auth tokens)
apiClient.interceptors.request.use(
  async (config) => {
    // Here we would fetch token from SecureStore if it exists
    // const token = await SecureStore.getItemAsync('metro_auth_token');
    // if (token && config.headers) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling global error codes
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Fail gracefully, logging details or wrapping in custom error classes
    console.warn('API Error Intercepted:', error.message || error);
    return Promise.reject(error);
  }
);

export default apiClient;
