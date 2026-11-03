import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { PerfilComponent } from './perfil.component';
import { PerfilService } from '../../services/perfil.service';
import { AuthService } from '@core/auth/services/auth.service';
import { UserProfile } from '../../models/perfil.model';

describe('PerfilComponent', () => {
  const mockProfile: UserProfile = {
    id: '1',
    name: 'Juan Pérez Rodríguez',
    email: 'juan.perez@example.com',
    phone: '+51 (073) 123-4567',
    location: 'Piura, Perú',
    joinDate: 'Septiembre 2026'
  };

  beforeEach(async () => {
    const perfilServiceMock = {
      getProfile: () => of(mockProfile),
      updateProfile: (data: Partial<UserProfile>) => of({ ...mockProfile, ...data })
    };
    const authServiceMock = {
      logout: () => of(undefined)
    };

    await TestBed.configureTestingModule({
      imports: [PerfilComponent],
      providers: [
        provideRouter([]),
        { provide: PerfilService, useValue: perfilServiceMock },
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(PerfilComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display user profile name', () => {
    const fixture = TestBed.createComponent(PerfilComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const profileName = compiled.querySelector('.profile-name');
    expect(profileName?.textContent).toContain('Juan Pérez Rodríguez');
  });

  it('should display contact information', () => {
    const fixture = TestBed.createComponent(PerfilComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const contactValues = compiled.querySelectorAll('.contact-value');
    expect(contactValues.length).toBe(3);
    expect(contactValues[0]?.textContent).toContain('juan.perez@example.com');
    expect(contactValues[1]?.textContent).toContain('+51 (073) 123-4567');
  });

  it('should render menu items', () => {
    const fixture = TestBed.createComponent(PerfilComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const menuButtons = compiled.querySelectorAll('.menu-button');
    expect(menuButtons.length).toBe(5);
  });

  it('should render the bottom navigation', () => {
    const fixture = TestBed.createComponent(PerfilComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-bottom-nav')).toBeTruthy();
  });
});
