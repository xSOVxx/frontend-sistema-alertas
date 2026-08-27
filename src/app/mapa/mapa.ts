import { Component, DestroyRef, ElementRef, ViewChild, afterNextRender, inject, signal } from '@angular/core';
import type * as maplibregl from 'maplibre-gl';
import { NavBottom } from '../nav/nav';
import { environment } from '../../environments/environment';

type StyleKind = 'base' | 'satellite';

interface Shelter {
  lat: number;
  lng: number;
  name: string;
}

interface BlockedRoad {
  lat: number;
  lng: number;
}

interface FloodZone {
  lat: number;
  lng: number;
  radius: number;
}

@Component({
  selector: 'app-mapa',
  imports: [NavBottom],
  templateUrl: './mapa.html',
  styleUrl: './mapa.css'
})
export class Mapa {
  protected readonly mapError = signal(false);

  @ViewChild('canvas')
  private readonly canvas?: ElementRef<HTMLDivElement>;

  private readonly destroyRef = inject(DestroyRef);
  private readonly shelters: Shelter[] = [
    { lat: -5.1901, lng: -80.6352, name: 'Albergue San Miguel' },
    { lat: -5.2006, lng: -80.6248, name: 'Albergue Santa Rosa' }
  ];

  private readonly blockedRoads: BlockedRoad[] = [
    { lat: -5.1962, lng: -80.6288 },
    { lat: -5.1898, lng: -80.6402 }
  ];

  private readonly floodZones: FloodZone[] = [
    { lat: -5.1958, lng: -80.6332, radius: 800 },
    { lat: -5.2005, lng: -80.6282, radius: 500 }
  ];

  private ml?: typeof maplibregl;
  private map?: maplibregl.Map;
  private styleKind: StyleKind = 'base';
  private markersAdded = false;
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
  }

  private styleUrl(kind: StyleKind): string {
    const style = kind === 'base' ? 'base-v4' : 'satellite';
    return `https://api.maptiler.com/maps/${style}/style.json?key=${environment.maptilerApiKey}`;
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

    this.shelters.forEach((shelter) => {
      new Marker({ element: this.buildPinElement(), anchor: 'bottom' })
        .setLngLat([shelter.lng, shelter.lat])
        .setPopup(new Popup({ offset: 28 }).setText(shelter.name))
        .addTo(this.map!);
    });

    this.blockedRoads.forEach((road) => {
      new Marker({ element: this.buildBlockElement() })
        .setLngLat([road.lng, road.lat])
        .addTo(this.map!);
    });
  }

  private addZones(): void {
    this.map?.addSource('flood-zones', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: this.floodZones.map((zone) => ({
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: [zone.lng, zone.lat]
          },
          properties: { radius: zone.radius }
        }))
      }
    });

    this.map?.addLayer({
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
    this.map.setStyle(this.styleUrl(this.styleKind));
    this.map.once('style.load', () => this.addZones());
  }
}
