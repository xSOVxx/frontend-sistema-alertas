export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: UserProfile;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  joinDate?: string;
  avatar?: string;
}

export type AlertKind = 'roja' | 'precaucion' | 'informacion';

export interface AlertItem {
  id: string;
  kind: AlertKind;
  icon: string;
  label: string;
  createdAt: string;
  title: string;
  description?: string;
  image?: string;
  actionLabel?: string;
  actionIcon?: string;
  latitude?: number;
  longitude?: number;
}

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

export interface VolunteerRequest {
  nombre: string;
  dni: string;
  habilidad: string;
}

export interface VolunteerResponse extends VolunteerRequest {
  id: string;
  createdAt: string;
}

export type StockStatus = 'adecuado' | 'critico' | 'agotado';

export interface StockItem {
  id: string;
  icon: string;
  name: string;
  stock: string;
  status: StockStatus;
}

export interface GoalItem {
  id: string;
  label: string;
  percent: number;
  mono: string;
  color: string;
}
