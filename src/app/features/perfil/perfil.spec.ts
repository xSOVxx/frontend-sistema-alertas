import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Perfil } from './perfil';

describe('Perfil', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Perfil],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(Perfil);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display user profile name', () => {
    const fixture = TestBed.createComponent(Perfil);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const profileName = compiled.querySelector('.profile-name');
    expect(profileName?.textContent).toContain('Juan Pérez Rodríguez');
  });

  it('should display contact information', () => {
    const fixture = TestBed.createComponent(Perfil);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const contactValues = compiled.querySelectorAll('.contact-value');
    expect(contactValues.length).toBe(3);
    expect(contactValues[0]?.textContent).toContain('juan.perez@example.com');
    expect(contactValues[1]?.textContent).toContain('+51 (073) 123-4567');
  });

  it('should render menu items', () => {
    const fixture = TestBed.createComponent(Perfil);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const menuButtons = compiled.querySelectorAll('.menu-button');
    expect(menuButtons.length).toBe(5);
  });

  it('should render the bottom navigation', () => {
    const fixture = TestBed.createComponent(Perfil);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-bottom-nav')).toBeTruthy();
  });
});
