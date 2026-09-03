// Claves públicas de cliente: se exponen en el bundle y no deben
// usarse para almacenar secretos. Para información sensible, usar
// variables de entorno del backend/servidor.
export const environment = {
  apiBaseUrl: 'http://localhost:3000',
  useMockAuth: false,
  services: {
    auth: 'http://localhost:3000',
    alerts: 'http://localhost:3000',
    maps: 'http://localhost:3000',
    aid: 'http://localhost:3000',
    users: 'http://localhost:3000',
    weather: 'http://localhost:3001',
    seismic: 'http://localhost:3002'
  },
  maptilerApiKey: '5SDHCuQINShPjv8AhcP8'
};
