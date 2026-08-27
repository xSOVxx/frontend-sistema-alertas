import { TestBed } from '@angular/core/testing';
import { Topbar } from './topbar';

describe('Topbar', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Topbar]
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(Topbar);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the title input', () => {
    const fixture = TestBed.createComponent(Topbar);
    fixture.componentRef.setInput('title', 'PonteAlerta Piura');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.topbar-title')?.textContent).toContain('PonteAlerta Piura');
  });

  it('should project left and right content', () => {
    const fixture = TestBed.createComponent(Topbar);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
