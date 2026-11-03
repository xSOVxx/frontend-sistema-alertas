import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { FeedComponent } from './feed.component';
import { AlertasService } from '../../services/alertas.service';
import { AlertItem } from '../../models/alert.model';

describe('FeedComponent', () => {
  const mockAlerts: AlertItem[] = [
    {
      id: '1',
      kind: 'roja',
      icon: 'warning',
      label: 'Alerta Roja',
      createdAt: 'Hace 5 min',
      title: 'Inundación en Castilla',
      description: 'Crecida de río'
    },
    {
      id: '2',
      kind: 'precaucion',
      icon: 'info',
      label: 'Precaución',
      createdAt: 'Hace 15 min',
      title: 'Cierre temporal de vía'
    },
    {
      id: '3',
      kind: 'informacion',
      icon: 'campaign',
      label: 'Información',
      createdAt: 'Hace 1 hora',
      title: 'Punto de acopio habilitado'
    }
  ];

  beforeEach(async () => {
    const alertasServiceMock = {
      getAlerts: () => of(mockAlerts),
      getAlert: (id: string) => of(mockAlerts.find((a) => a.id === id)!),
      triggerCoerScraping: () => of({ success: true, message: 'Scraping completado', count: 3 })
    };

    await TestBed.configureTestingModule({
      imports: [FeedComponent],
      providers: [
        provideRouter([]),
        { provide: AlertasService, useValue: alertasServiceMock }
      ]
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(FeedComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the app bar title', () => {
    const fixture = TestBed.createComponent(FeedComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.topbar-brand')?.textContent).toContain('PonteAlerta Piura');
  });

  it('should render alert cards', () => {
    const fixture = TestBed.createComponent(FeedComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('app-alert-card').length).toBe(3);
  });

  it('should filter cards by search query', () => {
    const fixture = TestBed.createComponent(FeedComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('.search-input') as HTMLInputElement;
    input.value = 'inundación';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(compiled.querySelectorAll('app-alert-card').length).toBe(1);
    expect(compiled.querySelector('.card-title')?.textContent).toContain('Inundación');
  });

  it('should render the bottom navigation', () => {
    const fixture = TestBed.createComponent(FeedComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-bottom-nav')).toBeTruthy();
  });
});
