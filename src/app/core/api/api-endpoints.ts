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
    shelter: (id: string) => `/map/shelters/${id}`,
    blockedRoads: '/map/blocked-roads',
    allBlockedRoads: '/map/blocked-roads/all',
    blockedRoad: (id: string) => `/map/blocked-roads/${id}`,
    floodZones: '/map/flood-zones',
    floodZone: (id: string) => `/map/flood-zones/${id}`,
    incidents: '/incidents'
  },
  volunteers: {
    register: '/volunteers',
    list: '/volunteers',
    status: (id: string) => `/volunteers/${id}/status`
  },
  inventory: {
    list: '/inventory',
    create: '/inventory',
    detail: (id: string) => `/inventory/${id}`
  },
  metrics: {
    summary: '/metrics/summary'
  },
  incidents: {
    admin: '/incidents/admin',
    update: (id: string) => `/incidents/${id}`,
    remove: (id: string) => `/incidents/${id}`
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
