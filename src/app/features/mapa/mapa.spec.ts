import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Mapa } from './mapa';

describe('Mapa', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mapa],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(Mapa);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the app bar title', () => {
    const fixture = TestBed.createComponent(Mapa);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.topbar-title')?.textContent).toContain('PonteAlerta Piura');
  });

  it('should render the map canvas and legend', () => {
    const fixture = TestBed.createComponent(Mapa);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.map-canvas')).toBeTruthy();
    expect(compiled.querySelector('.legend')?.textContent).toContain('Leyenda de Mapa');
  });

  it('should render the bottom navigation', () => {
    const fixture = TestBed.createComponent(Mapa);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-bottom-nav')).toBeTruthy();
  });
});
