// Claves públicas de cliente: se exponen en el bundle y no deben
// usarse para almacenar secretos. Para información sensible, usar
// variables de entorno del backend/servidor.
export const environment = {
  apiBaseUrl: 'http://localhost:3000',
  useMockAuth: true,
  maptilerApiKey: '5SDHCuQINShPjv8AhcP8'
};
