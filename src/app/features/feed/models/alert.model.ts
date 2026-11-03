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
