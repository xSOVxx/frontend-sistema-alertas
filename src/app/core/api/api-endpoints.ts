export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    forgotPassword: '/auth/forgot-password'
  },
  alerts: {
    list: '/alerts',
    detail: (id: string) => `/alerts/${id}`
  },
  map: {
    shelters: '/map/shelters',
    blockedRoads: '/map/blocked-roads',
    floodZones: '/map/flood-zones',
    incidents: '/incidents'
  },
  volunteers: {
    register: '/volunteers'
  },
  resources: {
    stock: '/resources/stock',
    goals: '/resources/goals'
  },
  profile: {
    me: '/users/me'
  }
} as const;
