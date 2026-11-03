import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TopbarComponent } from '@shared/index';
import { Ticket, TicketMetrics, TicketPriority, TicketStatus } from '../../models/ticket.model';
import { TicketsService } from '../../services/tickets.service';

const NEXT_STATUSES: Partial<Record<TicketStatus, TicketStatus[]>> = {
  NEW: ['ASSIGNED', 'CANCELLED'],
  ASSIGNED: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['WAITING_USER', 'RESOLVED', 'CANCELLED'],
  WAITING_USER: ['IN_PROGRESS', 'CANCELLED'],
  RESOLVED: ['CLOSED', 'IN_PROGRESS']
};

@Component({
  selector: 'app-admin-tickets',
  imports: [ReactiveFormsModule, TopbarComponent],
  templateUrl: './admin-tickets.component.html',
  styleUrl: './admin-tickets.component.css'
})
export class AdminTicketsComponent {
  private readonly ticketsService = inject(TicketsService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly metrics = signal<TicketMetrics | null>(null);
  protected readonly tickets = signal<Ticket[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly selected = signal<Ticket | null>(null);
  protected readonly saving = signal(false);

  protected readonly filters = new FormGroup({
    status: new FormControl(''),
    type: new FormControl(''),
    priority: new FormControl(''),
    search: new FormControl('')
  });

  constructor() {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set(null);
    const value = this.filters.getRawValue();

    this.ticketsService
      .list({
        status: (value.status || undefined) as TicketStatus | undefined,
        type: value.type || undefined,
        priority: value.priority || undefined,
        search: value.search || undefined
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (tickets) => {
          this.tickets.set(tickets);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.error.set('No se pudo cargar la bandeja de tickets.');
        }
      });

    this.ticketsService
      .getMetrics()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (metrics) => this.metrics.set(metrics),
        error: () => undefined
      });
  }

  protected open(ticket: Ticket): void {
    this.selected.set(ticket);
  }

  protected close(): void {
    this.selected.set(null);
  }

  protected nextStatuses(ticket: Ticket): TicketStatus[] {
    return NEXT_STATUSES[ticket.status] ?? [];
  }

  protected changeStatus(ticket: Ticket, status: TicketStatus): void {
    this.saving.set(true);
    this.ticketsService
      .update(ticket.id, { status })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.saving.set(false);
          this.selected.set(updated);
          this.load();
        },
        error: () => {
          this.saving.set(false);
          this.error.set('No se pudo actualizar el ticket.');
        }
      });
  }

  protected changePriority(ticket: Ticket, priority: string): void {
    this.saving.set(true);
    this.ticketsService
      .update(ticket.id, { priority: priority as TicketPriority })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.saving.set(false);
          this.selected.set(updated);
          this.load();
        },
        error: () => {
          this.saving.set(false);
          this.error.set('No se pudo actualizar la prioridad.');
        }
      });
  }

  protected downloadCsv(): void {
    this.ticketsService
      .exportCsv()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'tickets-pontealerta.csv';
          link.click();
          URL.revokeObjectURL(url);
        }
      });
  }

  protected statusLabel(status: TicketStatus): string {
    const labels: Record<TicketStatus, string> = {
      NEW: 'Nuevo',
      ASSIGNED: 'Asignado',
      IN_PROGRESS: 'En proceso',
      WAITING_USER: 'Esperando usuario',
      RESOLVED: 'Resuelto',
      CLOSED: 'Cerrado',
      CANCELLED: 'Cancelado'
    };
    return labels[status];
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

  protected slaPercent(metrics: TicketMetrics): number {
    return Math.min(100, Math.max(0, metrics.slaCompliancePercent));
  }
}
