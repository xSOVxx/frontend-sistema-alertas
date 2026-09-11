import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TopbarComponent } from './topbar.component';

describe('TopbarComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopbarComponent],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(TopbarComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the title input', () => {
    const fixture = TestBed.createComponent(TopbarComponent);
    fixture.componentRef.setInput('title', 'PonteAlerta Piura');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.topbar-title')?.textContent).toContain('PonteAlerta Piura');
  });

  it('should render the avatar link by default', () => {
    const fixture = TestBed.createComponent(TopbarComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const avatar = compiled.querySelector('a.avatar-btn');
    expect(avatar?.getAttribute('href')).toBe('/perfil');
  });

  it('should hide the avatar when showAvatar is false', () => {
    const fixture = TestBed.createComponent(TopbarComponent);
    fixture.componentRef.setInput('showAvatar', false);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('a.avatar-btn')).toBeNull();
  });
});
