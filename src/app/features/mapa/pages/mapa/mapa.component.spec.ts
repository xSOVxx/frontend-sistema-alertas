import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { MapaComponent } from './mapa.component';
import { MapaService } from '../../services/mapa.service';
import { MapData } from '../../models/mapa.model';

describe('MapaComponent', () => {
  const mockMapData: MapData = {
    shelters: [{ id: 's1', lat: -5.1945, lng: -80.6328, name: 'Albergue Central' }],
    blockedRoads: [{ id: 'r1', lat: -5.195, lng: -80.633, name: 'Av. Grau' }],
    floodZones: [{ id: 'z1', lat: -5.196, lng: -80.634, radius: 100, name: 'Zona Bajo Piura' }]
  };

  beforeEach(async () => {
    const mapaServiceMock = {
      getMapData: () => of(mockMapData),
      reportIncident: () => of(undefined)
    };

    await TestBed.configureTestingModule({
      imports: [MapaComponent],
      providers: [
        provideRouter([]),
        { provide: MapaService, useValue: mapaServiceMock }
      ]
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(MapaComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the app bar title', () => {
    const fixture = TestBed.createComponent(MapaComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.topbar-title')?.textContent).toContain('PonteAlerta Piura');
  });

  it('should render the map canvas and legend', () => {
    const fixture = TestBed.createComponent(MapaComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.map-canvas')).toBeTruthy();
    expect(compiled.querySelector('.legend')?.textContent).toContain('Leyenda de Mapa');
  });

  it('should render the bottom navigation', () => {
    const fixture = TestBed.createComponent(MapaComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-bottom-nav')).toBeTruthy();
  });
});
