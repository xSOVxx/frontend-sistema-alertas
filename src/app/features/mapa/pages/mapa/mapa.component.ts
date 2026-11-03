import { Component, DestroyRef, ElementRef, ViewChild, afterNextRender, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type * as maplibregl from 'maplibre-gl';
import { TopbarComponent, BottomNavComponent } from '@shared/index';
import { environment } from '@env/environment';
import { BlockedRoad, FloodZone, IncidentRequest, Shelter } from '../../models/mapa.model';
import { MapaService } from '../../services/mapa.service';
import { MapControlsComponent } from '../../components/map-controls/map-controls.component';
import { MapLegendComponent } from '../../components/map-legend/map-legend.component';

type StyleKind = 'base' | 'satellite';

@Component({
  selector: 'app-mapa',
  imports: [TopbarComponent, BottomNavComponent, MapControlsComponent, MapLegendComponent],
  templateUrl: './mapa.component.html',
  styleUrl: './mapa.component.css'
})
export class MapaComponent {
  private readonly mapaService = inject(MapaService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly mapError = signal(false);
  protected readonly loading = signal(true);
  protected readonly shelters = signal<Shelter[]>([]);
  protected readonly blockedRoads = signal<BlockedRoad[]>([]);
  protected readonly floodZones = signal<FloodZone[]>([]);

  @ViewChild('canvas')
  private readonly canvas?: ElementRef<HTMLDivElement>;

  private ml?: typeof maplibregl;
  private map?: maplibregl.Map;
  private styleKind: StyleKind = 'base';
  private markersAdded = false;
  private usingFallbackStyle = false;
  private destroyed = false;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.destroyed = true;
      this.map?.remove();
      this.map = undefined;
    });
    afterNextRender(() => {
      void this.initMap();
    });
    this.loadMapData();
  }

  private loadMapData(): void {
    this.mapaService.getMapData().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.shelters.set(data.shelters.filter((item) => this.isValidCoordinate(item.lat, item.lng)));
        this.blockedRoads.set(data.blockedRoads.filter((item) => this.isValidCoordinate(item.lat, item.lng)));
        this.floodZones.set(data.floodZones.filter((item) => this.isValidCoordinate(item.lat, item.lng)));
        this.loading.set(false);
        if (this.map?.isStyleLoaded()) {
          this.addZones();
          this.addMarkers();
        }
      },
      error: () => {
        this.loading.set(false);
        this.mapError.set(true);
      }
    });
  }

  private isValidCoordinate(lat: number, lng: number): boolean {
    return (
      Number.isFinite(lat) &&
      Number.isFinite(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    );
  }

  private styleUrl(kind: StyleKind): string {
    const style = kind === 'base' ? 'streets-v2' : 'satellite';
    return `https://api.maptiler.com/maps/${style}/style.json?key=${environment.maptilerApiKey}`;
  }

  private fallbackStyle(): maplibregl.StyleSpecification {
    return {
      version: 8,
      sources: {
        openstreetmap: {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '&copy; OpenStreetMap contributors'
        }
      },
      layers: [
        {
          id: 'openstreetmap',
          type: 'raster',
          source: 'openstreetmap'
        }
      ]
    };
  }

  private async initMap(): Promise<void> {
    const container = this.canvas?.nativeElement;
    if (!container) {
      return;
    }

    try {
      const module = await import('maplibre-gl');
      if (this.destroyed) {
        return;
      }
      this.ml = module;
      module.setWorkerUrl('maplibre-gl/maplibre-gl-worker.mjs');

      this.map = new module.Map({
        container,
        style: this.styleUrl('base'),
        center: [-80.6328, -5.1945],
        zoom: 14
      });

      this.map.on('error', (event) => {
        console.error('Error del mapa:', event.error);
        if (!this.usingFallbackStyle && this.map) {
          this.usingFallbackStyle = true;
          this.map.setStyle(this.fallbackStyle());
          return;
        }
        this.mapError.set(true);
      });

      this.map.on('load', () => {
        this.mapError.set(false);
        this.addZones();
        if (!this.markersAdded) {
          this.addMarkers();
          this.markersAdded = true;
        }
      });
    } catch (error) {
      console.error('Error del mapa:', error);
      this.mapError.set(true);
    }
  }

  private buildPinElement(): HTMLElement {
    const pin = document.createElement('div');
    pin.className = 'map-pin';
    const icon = document.createElement('span');
    icon.className = 'material-symbols-outlined filled';
    icon.textContent = 'home';
    pin.appendChild(icon);
    return pin;
  }

  private buildBlockElement(): HTMLElement {
    const block = document.createElement('div');
    block.className = 'road-block';
    const icon = document.createElement('span');
    icon.className = 'material-symbols-outlined';
    icon.textContent = 'close';
    block.appendChild(icon);
    return block;
  }

  private addMarkers(): void {
    if (!this.ml || !this.map) {
      return;
    }
    const { Marker, Popup } = this.ml;

    this.shelters().forEach((shelter) => {
      new Marker({ element: this.buildPinElement(), anchor: 'bottom' })
        .setLngLat([shelter.lng, shelter.lat])
        .setPopup(new Popup({ offset: 28 }).setText(shelter.name))
        .addTo(this.map!);
    });

    this.blockedRoads().forEach((road) => {
      new Marker({ element: this.buildBlockElement() })
        .setLngLat([road.lng, road.lat])
        .addTo(this.map!);
    });
  }

  private addZones(): void {
    if (!this.map || this.map.getSource('flood-zones')) {
      return;
    }
    this.map.addSource('flood-zones', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: this.floodZones().map((zone) => ({
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: [zone.lng, zone.lat]
          },
          properties: { radius: zone.radius }
        }))
      }
    });

    this.map.addLayer({
      id: 'flood-circles',
      type: 'circle',
      source: 'flood-zones',
      paint: {
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 12, 60, 16, 500],
        'circle-color': 'rgba(186, 26, 26, 0.18)',
        'circle-stroke-color': 'transparent'
      }
    });
  }

  protected locate(): void {
    if (!this.map || !navigator.geolocation) {
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (this.destroyed) {
          return;
        }
        this.map?.flyTo({
          center: [position.coords.longitude, position.coords.latitude],
          zoom: 16
        });
      },
      () => undefined,
      { timeout: 5000 }
    );
  }

  protected zoomIn(): void {
    this.map?.zoomIn();
  }

  protected zoomOut(): void {
    this.map?.zoomOut();
  }

  protected toggleLayer(): void {
    if (!this.map) {
      return;
    }
    this.styleKind = this.styleKind === 'base' ? 'satellite' : 'base';
    this.usingFallbackStyle = false;
    this.map.setStyle(this.styleUrl(this.styleKind));
    this.map.once('style.load', () => this.addZones());
  }

  protected reportIncident(): void {
    if (!navigator.geolocation) {
      this.mapError.set(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const incident: IncidentRequest = {
          type: 'general',
          description: 'Incidencia reportada desde el mapa',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        this.mapaService.reportIncident(incident).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          error: () => this.mapError.set(true)
        });
      },
      () => this.mapError.set(true),
      { timeout: 5000 }
    );
  }
}
