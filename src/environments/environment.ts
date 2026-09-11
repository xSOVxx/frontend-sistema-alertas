// Configuración de entorno para desarrollo y conexión local con NestJS backend
export const environment = {
  apiBaseUrl: 'http://localhost:3000',
  useMockAuth: true,
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
