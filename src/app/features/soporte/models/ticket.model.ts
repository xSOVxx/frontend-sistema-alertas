export type TicketType = 'INFORMATION' | 'ACCESS' | 'RESOURCE' | 'BUG' | 'IMPROVEMENT';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TicketStatus =
  | 'NEW'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'WAITING_USER'
  | 'RESOLVED'
  | 'CLOSED'
  | 'CANCELLED';

export interface TicketCatalogType {
  type: TicketType;
  label: string;
  description: string;
  defaultPriority: TicketPriority;
  categories: string[];
  examples: string[];
}

export interface TicketCatalog {
  title: string;
  version: string;
  types: TicketCatalogType[];
  sla: Record<TicketPriority, { responseMinutes: number; resolutionMinutes: number }>;
  flow: {
    initial: string;
    states: string[];
    transitions: Record<string, string[]>;
  };
  kpis: string[];
}

export interface TicketComment {
  id: string;
  ticketId: string;
  authorName: string;
  body: string;
  isInternal: boolean;
  createdAt: string;
}

export interface TicketHistory {
  id: string;
  fromStatus?: TicketStatus | null;
  toStatus: TicketStatus;
  note?: string | null;
  createdAt: string;
}

export interface Ticket {
  id: string;
  code: string;
  type: TicketType;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  subject: string;
  description: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone?: string | null;
  slaResponseDue: string;
  slaResolutionDue: string;
  firstResponseAt?: string | null;
  resolvedAt?: string | null;
  closedAt?: string | null;
  resolution?: string | null;
  createdAt: string;
  updatedAt: string;
  comments?: TicketComment[];
  history?: TicketHistory[];
}

export interface CreateTicketRequest {
  type: TicketType;
  category: string;
  subject: string;
  description: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateTicketRequest {
  status?: TicketStatus;
  priority?: TicketPriority;
  resolution?: string;
  note?: string;
}

export interface TicketMetrics {
  generatedAt: string;
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  overdueTickets: number;
  slaCompliancePercent: number;
  averageFirstResponseHours: number;
  averageResolutionHours: number;
  reopenedTickets: number;
  ticketsByType: Record<string, number>;
  ticketsByPriority: Record<string, number>;
  ticketsByStatus: Record<string, number>;
}
