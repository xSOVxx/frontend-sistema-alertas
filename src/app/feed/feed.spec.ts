import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Feed } from './feed';

describe('Feed', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Feed],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(Feed);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the app bar title', () => {
    const fixture = TestBed.createComponent(Feed);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.topbar-title')?.textContent).toContain('PonteAlerta Piura');
  });

  it('should render three alert cards', () => {
    const fixture = TestBed.createComponent(Feed);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.card').length).toBe(3);
  });

  it('should filter cards by search query', () => {
    const fixture = TestBed.createComponent(Feed);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('.search-input') as HTMLInputElement;
    input.value = 'inundación';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(compiled.querySelectorAll('.card').length).toBe(1);
    expect(compiled.querySelector('.card-title')?.textContent).toContain('Inundación');
  });

  it('should render the bottom navigation', () => {
    const fixture = TestBed.createComponent(Feed);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-nav-bottom')).toBeTruthy();
  });
});
