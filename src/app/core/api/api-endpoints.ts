export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    forgotPassword: '/auth/forgot-password'
  },
  alerts: {
    list: '/alerts',
    detail: (id: string) => `/alerts/${id}`
  },
  coerScraper: {
    sync: '/coer-scraper/test-coer'
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
  },
  tickets: {
    catalog: '/tickets/catalog',
    create: '/tickets',
    track: (code: string) => `/tickets/track/${encodeURIComponent(code)}`,
    mine: '/tickets/me',
    list: '/tickets',
    detail: (id: string) => `/tickets/${id}`,
    update: (id: string) => `/tickets/${id}`,
    comments: (id: string) => `/tickets/${id}/comments`,
    metrics: '/tickets/metrics',
    export: '/tickets/export'
  },
  weather: {
    current: '/weather/current',
    forecast: '/weather/forecast'
  },
  seismic: {
    recent: '/earthquakes/recent',
    riskPrediction: '/earthquakes/risk-prediction'
  }
} as const;
