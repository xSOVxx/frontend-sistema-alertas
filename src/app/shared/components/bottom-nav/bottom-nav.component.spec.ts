import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Router, provideRouter } from '@angular/router';
import { BottomNavComponent } from './bottom-nav.component';

@Component({ template: '' })
class DummyComponent {}

describe('BottomNavComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BottomNavComponent],
      providers: [provideRouter([{ path: 'mapa', component: DummyComponent }])]
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(BottomNavComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render five tabs', () => {
    const fixture = TestBed.createComponent(BottomNavComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.nav-btn').length).toBe(5);
  });

  it('should link to the Perfil route', () => {
    const fixture = TestBed.createComponent(BottomNavComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const anchors = compiled.querySelectorAll<HTMLAnchorElement>('a.nav-btn');
    const perfil = Array.from(anchors).find((a) => a.textContent?.includes('Perfil'));
    expect(perfil?.getAttribute('href')).toBe('/perfil');
  });

  it('should link to the correct routes', () => {
    const fixture = TestBed.createComponent(BottomNavComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const anchors = compiled.querySelectorAll<HTMLAnchorElement>('a.nav-btn');
    expect(anchors[0].getAttribute('href')).toBe('/feed');
    expect(anchors[1].getAttribute('href')).toBe('/mapa');
    expect(anchors[2].getAttribute('href')).toBe('/voluntariado');
    expect(anchors[3].getAttribute('href')).toBe('/soporte');
    expect(anchors[4].getAttribute('href')).toBe('/perfil');
  });

  it('should mark the active route', async () => {
    const fixture = TestBed.createComponent(BottomNavComponent);
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    await router.navigate(['/mapa']);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('a.nav-btn--active .nav-label')?.textContent).toBe('Mapa');
  });
});
