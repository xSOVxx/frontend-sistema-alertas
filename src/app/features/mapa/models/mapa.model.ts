export interface Shelter {
  id: string;
  lat: number;
  lng: number;
  name: string;
  capacity?: number;
  availableCapacity?: number;
}

export interface BlockedRoad {
  id: string;
  lat: number;
  lng: number;
  name?: string;
}

export interface FloodZone {
  id: string;
  lat: number;
  lng: number;
  radius: number;
  name?: string;
}

export interface IncidentRequest {
  type: string;
  description: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
}

export interface IncidentMarker {
  id: string;
  description: string;
  type: string;
  status: 'ACTIVE' | 'RESOLVED';
  source: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

export interface MapData {
  shelters: Shelter[];
  blockedRoads: BlockedRoad[];
  floodZones: FloodZone[];
}
