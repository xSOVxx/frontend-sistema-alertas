import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Router, provideRouter } from '@angular/router';
import { BottomNav } from './bottom-nav';

@Component({ template: '' })
class Dummy {}

describe('BottomNav', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BottomNav],
      providers: [provideRouter([{ path: 'mapa', component: Dummy }])]
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(BottomNav);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render four tabs', () => {
    const fixture = TestBed.createComponent(BottomNav);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.nav-btn').length).toBe(4);
  });

  it('should disable the Perfil tab', () => {
    const fixture = TestBed.createComponent(BottomNav);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll<HTMLButtonElement>('button.nav-btn');
    const perfil = buttons[0];
    expect(perfil.disabled).toBeTrue();
    expect(perfil.textContent).toContain('Perfil');
  });

  it('should link to the correct routes', () => {
    const fixture = TestBed.createComponent(BottomNav);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const anchors = compiled.querySelectorAll<HTMLAnchorElement>('a.nav-btn');
    expect(anchors[0].getAttribute('href')).toBe('/feed');
    expect(anchors[1].getAttribute('href')).toBe('/mapa');
    expect(anchors[2].getAttribute('href')).toBe('/voluntariado');
  });

  it('should mark the active route', async () => {
    const fixture = TestBed.createComponent(BottomNav);
    fixture.detectChanges();
    const router = TestBed.inject(Router);
    await router.navigate(['/mapa']);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('a.nav-btn--active .nav-label')?.textContent).toBe('Mapa');
  });
});
