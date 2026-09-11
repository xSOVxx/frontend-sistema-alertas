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
