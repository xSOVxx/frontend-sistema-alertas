import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { API_ENDPOINTS } from '@core/api/api-endpoints';
import { searchUbigeos, UbigeoItem, UBIGEOS_PIURA } from '@core/data/ubigeo-piura.data';
import { NetworkStatusService } from '@core/services/network-status.service';

export interface HelpNeed {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-solicitar-ayuda-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './solicitar-ayuda-modal.component.html',
  styleUrl: './solicitar-ayuda-modal.component.css'
})
export class SolicitarAyudaModalComponent {
  private readonly http = inject(HttpClient);
  protected readonly network = inject(NetworkStatusService);

  @Output() close = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<any>();

  protected readonly districtSearch = signal('');
  protected readonly filteredUbigeos = signal<UbigeoItem[]>(UBIGEOS_PIURA.slice(0, 6));
  protected readonly selectedUbigeo = signal<UbigeoItem | null>(null);

  protected readonly availableNeeds: HelpNeed[] = [
    { id: 'agua', label: 'Agua Potable', icon: 'water_drop' },
    { id: 'alimentos', label: 'Alimentos', icon: 'lunch_dining' },
    { id: 'medicinas', label: 'Medicinas / Primeros Auxilios', icon: 'medical_services' },
    { id: 'refugio', label: 'Calaminas / Carpas / Sacos', icon: 'roofing' },
    { id: 'rescate', label: 'Evacuación / Rescate Urgente', icon: 'emergency' }
  ];

  protected readonly selectedNeeds = signal<string[]>(['agua', 'alimentos']);

  protected contactName = '';
  protected phone = '';
  protected address = '';
  protected description = '';
  protected gpsLocation = signal<{ lat: number; lng: number } | null>(null);

  protected readonly loading = signal(false);
  protected readonly successTicket = signal<string | null>(null);
  protected readonly isOfflineSubmission = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected onSearchDistrict(text: string): void {
    this.districtSearch.set(text);
    const results = searchUbigeos(text);
    this.filteredUbigeos.set(results.slice(0, 6));

    const exactMatch = results.find(
      (u) =>
        u.district.toLowerCase() === text.trim().toLowerCase() ||
        u.code === text.trim()
    );
    if (exactMatch) {
      this.selectUbigeo(exactMatch);
    }
  }

  protected selectUbigeo(item: UbigeoItem): void {
    this.selectedUbigeo.set(item);
    this.districtSearch.set(item.district);
    this.filteredUbigeos.set([]);
  }

  protected toggleNeed(id: string): void {
    const current = this.selectedNeeds();
    if (current.includes(id)) {
      this.selectedNeeds.set(current.filter((n) => n !== id));
    } else {
      this.selectedNeeds.set([...current, id]);
    }
  }

  protected isNeedSelected(id: string): boolean {
    return this.selectedNeeds().includes(id);
  }

  protected getGpsLocation(): void {
    if (!navigator.geolocation) {
      this.errorMessage.set('La geolocalización no es compatible con este navegador.');
      return;
    }

    this.loading.set(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.loading.set(false);
        this.gpsLocation.set({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      () => {
        this.loading.set(false);
        this.errorMessage.set('No se pudo obtener el GPS. Por favor indica tu distrito o referencia.');
        setTimeout(() => this.errorMessage.set(null), 4000);
      },
      { timeout: 8000 }
    );
  }

  protected submitHelpRequest(): void {
    if (!this.contactName.trim() || !this.phone.trim()) {
      this.errorMessage.set('Por favor ingresa tu nombre y un teléfono de contacto.');
      return;
    }

    const ubigeo = this.selectedUbigeo();
    const gps = this.gpsLocation();

    const latitude = gps?.lat ?? ubigeo?.latitude ?? -5.1945;
    const longitude = gps?.lng ?? ubigeo?.longitude ?? -80.6328;

    const payload = {
      description: this.description.trim() || 'Solicitud urgente de ayuda para damnificados',
      type: this.selectedNeeds().includes('rescate') ? 'FLOOD' : 'REFUGE',
      latitude,
      longitude,
      source: 'DAMNIFICADO',
      contactName: this.contactName.trim(),
      phone: this.phone.trim(),
      ubigeo: ubigeo?.code || '200101',
      district: ubigeo?.district || this.districtSearch() || 'Piura',
      address: this.address.trim(),
      needs: this.selectedNeeds(),
      metadata: {
        contactName: this.contactName.trim(),
        phone: this.phone.trim(),
        ubigeo: ubigeo?.code || '200101',
        district: ubigeo?.district || this.districtSearch() || 'Piura',
        address: this.address.trim(),
        needs: this.selectedNeeds(),
        gpsUsed: !!gps
      }
    };

    this.loading.set(true);
    this.errorMessage.set(null);

    // Si el usuario está offline por catástrofe, guardar en cola local y confirmar
    if (!this.network.isOnline()) {
      const offlineTicket = this.network.queueOfflineHelpRequest(payload);
      this.loading.set(false);
      this.isOfflineSubmission.set(true);
      this.successTicket.set(offlineTicket);
      this.submitted.emit({ id: offlineTicket, offline: true });
      return;
    }

    const endpoint = `${environment.apiBaseUrl}${API_ENDPOINTS.map.incidents}`;

    this.http.post<any>(endpoint, payload).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.isOfflineSubmission.set(false);
        this.successTicket.set(res.id || 'REG-' + Math.floor(Math.random() * 90000 + 10000));
        this.submitted.emit(res);
      },
      error: () => {
        // Fallback de contingencia: Si falló la red, guardar en cola offline
        const offlineTicket = this.network.queueOfflineHelpRequest(payload);
        this.loading.set(false);
        this.isOfflineSubmission.set(true);
        this.successTicket.set(offlineTicket);
        this.submitted.emit({ id: offlineTicket, offline: true });
      }
    });
  }

  protected onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close.emit();
    }
  }
}
