import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ButtonComponent } from './button.component';

describe('Button', () => {
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    fixture.componentRef.setInput('text', 'Click');
    fixture.componentRef.setInput('variant', 'secondary');
    fixture.componentRef.setInput('outlined', true);
    fixture.detectChanges();
  });

  it('should render the selected variant, outlined and emit clicks', () => {
    const clicked = vi.fn();
    fixture.componentInstance.clicked.subscribe(clicked);
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    button.click();

    expect(button.classList).toContain('outlined');
    expect(button.classList).toContain('secondary');
    expect(clicked).toHaveBeenCalled();
  });

  it('should not emit clicks while disabled', () => {
    const clicked = vi.fn();
    fixture.componentInstance.clicked.subscribe(clicked);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button').click();

    expect(clicked).not.toHaveBeenCalled();
  });
});
