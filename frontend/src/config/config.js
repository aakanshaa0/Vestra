export const config = {
  backendUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000',
  apiUrl: (import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000') + '/api'
};

export default config;