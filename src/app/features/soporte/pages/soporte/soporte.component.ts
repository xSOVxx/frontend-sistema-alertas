import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TopbarComponent, BottomNavComponent } from '@shared/index';
import { SessionService } from '@core/auth/services/session.service';
import { Ticket, TicketCatalog, TicketStatus, TicketType } from '../../models/ticket.model';
import { TicketsService } from '../../services/tickets.service';

type SupportTab = 'new' | 'track' | 'mine';

@Component({
  selector: 'app-soporte',
  imports: [ReactiveFormsModule, TopbarComponent, BottomNavComponent],
  templateUrl: './soporte.component.html',
  styleUrl: './soporte.component.css'
})
export class SoporteComponent {
  private readonly ticketsService = inject(TicketsService);
  private readonly session = inject(SessionService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly tab = signal<SupportTab>('new');
  protected readonly catalog = signal<TicketCatalog | null>(null);
  protected readonly loadingCatalog = signal(true);
  protected readonly submitting = signal(false);
  protected readonly tracking = signal(false);
  protected readonly loadingMine = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly createdTicket = signal<Ticket | null>(null);
  protected readonly trackedTicket = signal<Ticket | null>(null);
  protected readonly myTickets = signal<Ticket[]>([]);

  protected readonly createForm = new FormGroup({
    type: new FormControl<TicketType>('INFORMATION', { nonNullable: true }),
    category: new FormControl('general', { nonNullable: true, validators: [Validators.required] }),
    subject: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5), Validators.maxLength(150)]
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]
    }),
    requesterName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)]
    }),
    requesterEmail: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    requesterPhone: new FormControl('', {
      nonNullable: true,
      validators: [Validators.pattern(/^\d{9}$/)]
    })
  });

  protected readonly trackForm = new FormGroup({
    code: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.email] })
  });

  constructor() {
    const user = this.session.user();
    if (user) {
      this.createForm.patchValue({
        requesterName: user.name,
        requesterEmail: user.email,
        requesterPhone: user.phone ?? ''
      });
      this.trackForm.patchValue({ email: user.email });
    }

    this.ticketsService
      .getCatalog()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (catalog) => {
          this.catalog.set(catalog);
          this.loadingCatalog.set(false);
        },
        error: () => {
          this.loadingCatalog.set(false);
          this.error.set('No se pudo cargar el catálogo de solicitudes.');
        }
      });
  }

  protected setTab(tab: SupportTab): void {
    this.tab.set(tab);
    this.error.set(null);
    if (tab === 'mine') {
      this.loadMine();
    }
  }

  protected typeOptions() {
    return this.catalog()?.types ?? [];
  }

  protected categoryOptions(): string[] {
    const selected = this.createForm.controls.type.value;
    return this.catalog()?.types.find((item) => item.type === selected)?.categories ?? ['otros'];
  }

  protected onTypeChange(value: string): void {
    const type = value as TicketType;
    this.createForm.controls.type.setValue(type);
    const category = this.categoryOptions()[0] ?? 'otros';
    this.createForm.controls.category.setValue(category);
  }

  protected submit(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.error.set(null);
    const value = this.createForm.getRawValue();

    this.ticketsService
      .create({
        type: value.type,
        category: value.category,
        subject: value.subject,
        description: value.description,
        requesterName: value.requesterName,
        requesterEmail: value.requesterEmail,
        requesterPhone: value.requesterPhone || undefined
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (ticket) => {
          this.submitting.set(false);
          this.createdTicket.set(ticket);
          this.createForm.patchValue({
            subject: '',
            description: ''
          });
        },
        error: (err) => {
          this.submitting.set(false);
          this.error.set(this.errorMessage(err, 'No se pudo crear el ticket.'));
        }
      });
  }

  protected track(): void {
    if (this.trackForm.invalid) {
      this.trackForm.markAllAsTouched();
      return;
    }

    this.tracking.set(true);
    this.error.set(null);
    const { code, email } = this.trackForm.getRawValue();

    this.ticketsService
      .track(code.trim(), email.trim() || undefined)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (ticket) => {
          this.tracking.set(false);
          this.trackedTicket.set(ticket);
        },
        error: () => {
          this.tracking.set(false);
          this.trackedTicket.set(null);
          this.error.set('No se encontró un ticket con ese código.');
        }
      });
  }

  protected loadMine(): void {
    if (!this.session.isAuthenticated()) {
      this.error.set('Inicia sesión para ver tus tickets.');
      return;
    }

    this.loadingMine.set(true);
    this.ticketsService
      .getMine()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (tickets) => {
          this.myTickets.set(tickets);
          this.loadingMine.set(false);
        },
        error: () => {
          this.loadingMine.set(false);
          this.error.set('No se pudieron cargar tus tickets.');
        }
      });
  }

  protected statusLabel(status: TicketStatus): string {
    const labels: Record<TicketStatus, string> = {
      NEW: 'Nuevo',
      ASSIGNED: 'Asignado',
      IN_PROGRESS: 'En proceso',
      WAITING_USER: 'Esperando respuesta',
      RESOLVED: 'Resuelto',
      CLOSED: 'Cerrado',
      CANCELLED: 'Cancelado'
    };
    return labels[status];
  }

  protected typeLabel(type: TicketType): string {
    return this.catalog()?.types.find((item) => item.type === type)?.label ?? type;
  }

  protected formatDate(value?: string): string {
    if (!value) return '';
    const date = new Date(value);
    return isNaN(date.getTime())
      ? value
      : date.toLocaleDateString('es-PE', {
          day: '2-digit',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        });
  }

  private errorMessage(err: any, fallback: string): string {
    const detail = err?.error?.message;
    return Array.isArray(detail) ? detail.join('. ') : detail || fallback;
  }
}
