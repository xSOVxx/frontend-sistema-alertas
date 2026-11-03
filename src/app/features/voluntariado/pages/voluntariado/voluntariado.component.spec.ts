import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { VoluntariadoComponent } from './voluntariado.component';
import { AyudaService } from '../../services/ayuda.service';
import { StockItem, GoalItem } from '../../models/voluntariado.model';

describe('VoluntariadoComponent', () => {
  const mockStock: StockItem[] = [
    { id: '1', icon: 'water_drop', name: 'Agua Potable', stock: '2,500 L', status: 'adecuado' },
    { id: '2', icon: 'medical_services', name: 'Botiquines', stock: '120 u', status: 'critico' },
    { id: '3', icon: 'inventory', name: 'Alimentos', stock: '450 kg', status: 'adecuado' },
    { id: '4', icon: 'bed', name: 'Frazadas', stock: '0 u', status: 'agotado' }
  ];

  const mockGoals: GoalItem[] = [
    { id: '1', label: 'Meta de Alimentos', percent: 65, mono: '65%', color: '#16a34a' },
    { id: '2', label: 'Meta de Frazadas', percent: 30, mono: '30%', color: '#ca8a04' }
  ];

  beforeEach(async () => {
    const ayudaServiceMock = {
      getStock: () => of(mockStock),
      getGoals: () => of(mockGoals),
      registerVolunteer: () => of({ id: 'v1', createdAt: '2026-09-10', nombre: 'Test', dni: '12345678', habilidad: 'apoyo' })
    };

    await TestBed.configureTestingModule({
      imports: [VoluntariadoComponent],
      providers: [
        provideRouter([]),
        { provide: AyudaService, useValue: ayudaServiceMock }
      ]
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(VoluntariadoComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the page title', () => {
    const fixture = TestBed.createComponent(VoluntariadoComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.title')?.textContent).toContain('Voluntariado y Donaciones');
  });

  it('should render the stock table with four rows', () => {
    const fixture = TestBed.createComponent(VoluntariadoComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.table tbody tr').length).toBe(4);
  });

  it('should render two progress goals', () => {
    const fixture = TestBed.createComponent(VoluntariadoComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.goal').length).toBe(2);
  });

  it('should disable the submit button while the form is invalid', () => {
    const fixture = TestBed.createComponent(VoluntariadoComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button.submit') as HTMLButtonElement;
    expect(button.disabled).toBeTrue();
  });

  it('should render the bottom navigation', () => {
    const fixture = TestBed.createComponent(VoluntariadoComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-bottom-nav')).toBeTruthy();
  });
});
