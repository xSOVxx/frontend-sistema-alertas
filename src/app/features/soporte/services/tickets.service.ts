import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { API_ENDPOINTS } from '@core/api/api-endpoints';
import {
  CreateTicketRequest,
  Ticket,
  TicketCatalog,
  TicketComment,
  TicketMetrics,
  TicketStatus,
  UpdateTicketRequest
} from '../models/ticket.model';

@Injectable({ providedIn: 'root' })
export class TicketsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.services.users;

  getCatalog(): Observable<TicketCatalog> {
    return this.http.get<TicketCatalog>(this.url(API_ENDPOINTS.tickets.catalog));
  }

  create(request: CreateTicketRequest): Observable<Ticket> {
    return this.http.post<Ticket>(this.url(API_ENDPOINTS.tickets.create), request);
  }

  track(code: string, email?: string): Observable<Ticket> {
    let params = new HttpParams();
    if (email) params = params.set('email', email);
    return this.http.get<Ticket>(this.url(API_ENDPOINTS.tickets.track(code)), { params });
  }

  getMine(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.url(API_ENDPOINTS.tickets.mine));
  }

  list(filters?: {
    status?: TicketStatus;
    type?: string;
    priority?: string;
    search?: string;
  }): Observable<Ticket[]> {
    let params = new HttpParams();
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.type) params = params.set('type', filters.type);
    if (filters?.priority) params = params.set('priority', filters.priority);
    if (filters?.search) params = params.set('search', filters.search);
    return this.http.get<Ticket[]>(this.url(API_ENDPOINTS.tickets.list), { params });
  }

  get(id: string): Observable<Ticket> {
    return this.http.get<Ticket>(this.url(API_ENDPOINTS.tickets.detail(id)));
  }

  update(id: string, request: UpdateTicketRequest): Observable<Ticket> {
    return this.http.patch<Ticket>(this.url(API_ENDPOINTS.tickets.update(id)), request);
  }

  addComment(id: string, body: string, isInternal = false): Observable<TicketComment> {
    return this.http.post<TicketComment>(this.url(API_ENDPOINTS.tickets.comments(id)), {
      body,
      isInternal
    });
  }

  getComments(id: string): Observable<TicketComment[]> {
    return this.http.get<TicketComment[]>(this.url(API_ENDPOINTS.tickets.comments(id)));
  }

  getMetrics(): Observable<TicketMetrics> {
    return this.http.get<TicketMetrics>(this.url(API_ENDPOINTS.tickets.metrics));
  }

  exportCsv(): Observable<Blob> {
    return this.http.get(this.url(API_ENDPOINTS.tickets.export), {
      responseType: 'blob'
    });
  }

  private url(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }
}
