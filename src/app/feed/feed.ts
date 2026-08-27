import { Component, computed, signal } from '@angular/core';
import { NavBottom } from '../nav/nav';

interface AlertItem {
  kind: 'roja' | 'precaucion' | 'informacion';
  icon: string;
  label: string;
  time: string;
  title: string;
  description?: string;
  image?: string;
  actionLabel: string;
  actionIcon: string;
}

@Component({
  selector: 'app-feed',
  imports: [NavBottom],
  templateUrl: './feed.html',
  styleUrl: './feed.css'
})
export class Feed {
  protected readonly searchQuery = signal('');

  protected readonly alerts = signal<AlertItem[]>([
    {
      kind: 'roja',
      icon: 'warning',
      label: 'Alerta Roja',
      time: 'Hace 2 min',
      title: 'Inundación en el Bajo Piura - Evacuación inmediata',
      description:
        'Los niveles del río han superado la cota de desborde. Se requiere evacuación inmediata de todos los residentes hacia las zonas altas designadas en el plan de emergencia.',
      actionLabel: 'Rutas Evacuación',
      actionIcon: 'directions_run'
    },
    {
      kind: 'precaucion',
      icon: 'construction',
      label: 'Precaución',
      time: 'Hace 15 min',
      title: 'Vía Piura-Chulucanas cerrada por desprendimiento',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC47dJGluxQMAcClgbmhrFgQjP0xj8LmUd46Bj5hnvNz14P8HyNMmMeQKErUhQMZ0rRLuvDMSZCwiCPu5gA7zDzBzeUONvrV_ZUtDFc-q7SGqJTK9HBw9uhtf2X03FKvILIeKD-3uEZ76deF1B8FOsGnaENZo8OTUMIqV3E88vo7wSNz95ROESfWS0f3jn0G1Mf_rR48iprvFKJqADW54yasT5q0gxyN44dPb4jyHkiY1cW4jNkt4zM',
      actionLabel: 'Ver Desvíos',
      actionIcon: 'map'
    },
    {
      kind: 'informacion',
      icon: 'check_circle',
      label: 'Información',
      time: 'Hace 1 hora',
      title: 'Refugio Colegio San Miguel habilitado',
      description:
        'El centro educativo ha sido acondicionado con suministros básicos y camas temporales. Capacidad actual: 45%.',
      actionLabel: 'Cómo llegar',
      actionIcon: 'directions'
    }
  ]);

  protected readonly filteredAlerts = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) {
      return this.alerts();
    }
    return this.alerts().filter((alert) =>
      `${alert.title} ${alert.label} ${alert.description ?? ''}`.toLowerCase().includes(query)
    );
  });

  protected onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }
}
