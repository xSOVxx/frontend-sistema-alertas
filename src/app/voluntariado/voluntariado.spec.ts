import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Voluntariado } from './voluntariado';

describe('Voluntariado', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Voluntariado],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(Voluntariado);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the page title', () => {
    const fixture = TestBed.createComponent(Voluntariado);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.title')?.textContent).toContain('Voluntariado y Donaciones');
  });

  it('should render the stock table with four rows', () => {
    const fixture = TestBed.createComponent(Voluntariado);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.table tbody tr').length).toBe(4);
  });

  it('should render two progress goals', () => {
    const fixture = TestBed.createComponent(Voluntariado);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.goal').length).toBe(2);
  });

  it('should disable the submit button while the form is invalid', () => {
    const fixture = TestBed.createComponent(Voluntariado);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button.submit') as HTMLButtonElement;
    expect(button.disabled).toBeTrue();
  });

  it('should render the bottom navigation', () => {
    const fixture = TestBed.createComponent(Voluntariado);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-nav-bottom')).toBeTruthy();
  });
});
