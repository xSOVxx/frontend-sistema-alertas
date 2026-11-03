export type ItemCategory = 'FOOD' | 'CLOTHING' | 'MEDICINE' | 'TOOLS';
export type Severity = 'RED' | 'YELLOW' | 'GREEN';
export type VolunteerStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface InventoryItem {
  id: string;
  name: string;
  category: ItemCategory;
  quantity: number;
  unit: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface Shelter {
  id: string;
  name: string;
  lat: number;
  lng: number;
  capacity?: number | null;
  availableCapacity?: number | null;
  address?: string | null;
}

export interface FloodZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number;
  severity: Severity;
}

export interface RoadBlockade {
  id: string;
  latitude: number;
  longitude: number;
  description: string;
  severity: Severity;
  status: 'ACTIVE' | 'RESOLVED';
  source: 'SUTRAN' | 'CITIZEN';
  createdAt: string;
  updatedAt: string;
}

export interface Volunteer {
  id: string;
  nombre: string;
  dni: string;
  habilidad: string;
  email?: string | null;
  phone?: string | null;
  status: VolunteerStatus;
  createdAt: string;
}

export interface MetricsSummary {
  generatedAt: string;
  version: string;
  uptimeSeconds: number;
  memory: { rssMb: number; heapUsedMb: number; heapTotalMb: number };
  http: {
    totalRequests: number;
    errors5xx: number;
    rateLimited: number;
    errorRatePercent: number;
    p95LatencyMs: number;
  };
  business: {
    ticketsOpen: number;
    ticketsResolved: number;
    ticketsTotal: number;
    slaCompliancePercent: number;
    averageResolutionHours: number;
    activeIncidents: number;
    pendingVolunteers: number;
    volunteersTotal: number;
    inventoryItems: number;
    shelters: number;
    floodZones: number;
    blockedRoads: number;
  };
  services: { database: string; api: string };
}
