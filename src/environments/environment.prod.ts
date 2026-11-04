// Configuración de producción.
// Cambia las URLs por el backend público (Render, túnel o dominio propio).
//const API_URL = 'http://localhost:3000';
const API_URL = 'https://integrador-ii-backend.onrender.com'; // Cambiar por la URL pública del backend

export const environment = {
  apiBaseUrl: API_URL,
  useMockAuth: false,
  services: {
    auth: API_URL,
    alerts: API_URL,
    maps: API_URL,
    aid: API_URL,
    users: API_URL,
    weather: API_URL,
    seismic: API_URL
  },
  maptilerApiKey: '5SDHCuQINShPjv8AhcP8'
};
