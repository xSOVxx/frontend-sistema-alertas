import { TestBed } from '@angular/core/testing';
import { Login } from './login';

describe('Login', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login]
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(Login);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the app title', () => {
    const fixture = TestBed.createComponent(Login);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('PonteAlerta Piura');
  });

  it('should disable the submit button while the form is invalid', () => {
    const fixture = TestBed.createComponent(Login);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button.submit') as HTMLButtonElement;
    expect(button.disabled).toBeTrue();
  });
});
