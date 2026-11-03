import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { TopbarComponent } from '@shared/index';
import {
  FloodZone,
  InventoryItem,
  ItemCategory,
  RoadBlockade,
  Severity,
  Shelter,
  Volunteer,
  VolunteerStatus
} from '../../models/admin.models';
import { AdminService } from '../../services/admin.service';

type AdminTab = 'inventory' | 'shelters' | 'roads' | 'zones' | 'volunteers';

@Component({
  selector: 'app-admin-resources',
  imports: [ReactiveFormsModule, TopbarComponent],
  templateUrl: './admin-resources.component.html',
  styleUrl: './admin-resources.component.css'
})
export class AdminResourcesComponent {
  private readonly adminService = inject(AdminService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly tab = signal<AdminTab>('inventory');
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly success = signal<string | null>(null);

  protected readonly inventory = signal<InventoryItem[]>([]);
  protected readonly shelters = signal<Shelter[]>([]);
  protected readonly roads = signal<RoadBlockade[]>([]);
  protected readonly zones = signal<FloodZone[]>([]);
  protected readonly volunteers = signal<Volunteer[]>([]);

  protected readonly editingInventoryId = signal<string | null>(null);
  protected readonly editingShelterId = signal<string | null>(null);
  protected readonly editingRoadId = signal<string | null>(null);
  protected readonly editingZoneId = signal<string | null>(null);

  protected readonly categories: ItemCategory[] = ['FOOD', 'CLOTHING', 'MEDICINE', 'TOOLS'];
  protected readonly severities: Severity[] = ['RED', 'YELLOW', 'GREEN'];

  protected readonly inventoryForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    category: new FormControl<ItemCategory>('FOOD', { nonNullable: true }),
    quantity: new FormControl(0, { nonNullable: true, validators: [Validators.min(0)] }),
    unit: new FormControl('unidades', { nonNullable: true, validators: [Validators.required] }),
    location: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  protected readonly shelterForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    lat: new FormControl(-5.1945, { nonNullable: true }),
    lng: new FormControl(-80.6328, { nonNullable: true }),
    capacity: new FormControl(0, { nonNullable: true, validators: [Validators.min(0)] }),
    availableCapacity: new FormControl(0, { nonNullable: true, validators: [Validators.min(0)] }),
    address: new FormControl('', { nonNullable: true })
  });

  protected readonly roadForm = new FormGroup({
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    latitude: new FormControl(-5.18, { nonNullable: true }),
    longitude: new FormControl(-80.65, { nonNullable: true }),
    severity: new FormControl<Severity>('YELLOW', { nonNullable: true }),
    status: new FormControl<'ACTIVE' | 'RESOLVED'>('ACTIVE', { nonNullable: true })
  });

  protected readonly zoneForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    lat: new FormControl(-5.21, { nonNullable: true }),
    lng: new FormControl(-80.64, { nonNullable: true }),
    radius: new FormControl(1000, { nonNullable: true, validators: [Validators.min(1)] }),
    severity: new FormControl<Severity>('YELLOW', { nonNullable: true })
  });

  constructor() {
    this.loadAll();
  }

  protected setTab(tab: AdminTab): void {
    this.tab.set(tab);
    this.error.set(null);
    this.success.set(null);
  }

  protected loadAll(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      inventory: this.adminService.getInventory(),
      shelters: this.adminService.getShelters(),
      roads: this.adminService.getAllRoads(),
      zones: this.adminService.getFloodZones(),
      volunteers: this.adminService.getVolunteers()
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.inventory.set(data.inventory);
          this.shelters.set(data.shelters);
          this.roads.set(data.roads);
          this.zones.set(data.zones);
          this.volunteers.set(data.volunteers);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.error.set('No se pudo cargar la información administrativa.');
        }
      });
  }

  protected editInventory(item: InventoryItem): void {
    this.editingInventoryId.set(item.id);
    this.inventoryForm.patchValue({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      location: item.location
    });
  }

  protected resetInventory(): void {
    this.editingInventoryId.set(null);
    this.inventoryForm.reset({
      name: '',
      category: 'FOOD',
      quantity: 0,
      unit: 'unidades',
      location: ''
    });
  }

  protected saveInventory(): void {
    if (this.inventoryForm.invalid) {
      this.inventoryForm.markAllAsTouched();
      return;
    }
    const value = this.inventoryForm.getRawValue();
    const payload = {
      name: value.name,
      category: value.category,
      quantity: value.quantity,
      unit: value.unit,
      location: value.location
    };
    const id = this.editingInventoryId();
    this.runSave(
      id ? this.adminService.updateInventory(id, payload) : this.adminService.createInventory(payload),
      'Inventario actualizado'
    );
  }

  protected deleteInventory(item: InventoryItem): void {
    if (!confirm(`¿Eliminar "${item.name}"?`)) return;
    this.runDelete(this.adminService.deleteInventory(item.id), 'Ítem eliminado');
  }

  protected editShelter(item: Shelter): void {
    this.editingShelterId.set(item.id);
    this.shelterForm.patchValue({
      name: item.name,
      lat: item.lat,
      lng: item.lng,
      capacity: item.capacity ?? 0,
      availableCapacity: item.availableCapacity ?? 0,
      address: item.address ?? ''
    });
  }

  protected resetShelter(): void {
    this.editingShelterId.set(null);
    this.shelterForm.reset({
      name: '',
      lat: -5.1945,
      lng: -80.6328,
      capacity: 0,
      availableCapacity: 0,
      address: ''
    });
  }

  protected saveShelter(): void {
    if (this.shelterForm.invalid) {
      this.shelterForm.markAllAsTouched();
      return;
    }
    const value = this.shelterForm.getRawValue();
    const id = this.editingShelterId();
    this.runSave(
      id
        ? this.adminService.updateShelter(id, value)
        : this.adminService.createShelter(value),
      'Albergue guardado'
    );
  }

  protected deleteShelter(item: Shelter): void {
    if (!confirm(`¿Eliminar el albergue "${item.name}"?`)) return;
    this.runDelete(this.adminService.deleteShelter(item.id), 'Albergue eliminado');
  }

  protected editRoad(item: RoadBlockade): void {
    this.editingRoadId.set(item.id);
    this.roadForm.patchValue({
      description: item.description,
      latitude: item.latitude,
      longitude: item.longitude,
      severity: item.severity,
      status: item.status
    });
  }

  protected resetRoad(): void {
    this.editingRoadId.set(null);
    this.roadForm.reset({
      description: '',
      latitude: -5.18,
      longitude: -80.65,
      severity: 'YELLOW',
      status: 'ACTIVE'
    });
  }

  protected saveRoad(): void {
    if (this.roadForm.invalid) {
      this.roadForm.markAllAsTouched();
      return;
    }
    const value = this.roadForm.getRawValue();
    const id = this.editingRoadId();
    this.runSave(
      id ? this.adminService.updateRoad(id, value) : this.adminService.createRoad(value),
      'Vía bloqueada guardada'
    );
  }

  protected deleteRoad(item: RoadBlockade): void {
    if (!confirm('¿Eliminar esta vía bloqueada?')) return;
    this.runDelete(this.adminService.deleteRoad(item.id), 'Vía eliminada');
  }

  protected editZone(item: FloodZone): void {
    this.editingZoneId.set(item.id);
    this.zoneForm.patchValue({
      name: item.name,
      lat: item.lat,
      lng: item.lng,
      radius: item.radius,
      severity: item.severity
    });
  }

  protected resetZone(): void {
    this.editingZoneId.set(null);
    this.zoneForm.reset({
      name: '',
      lat: -5.21,
      lng: -80.64,
      radius: 1000,
      severity: 'YELLOW'
    });
  }

  protected saveZone(): void {
    if (this.zoneForm.invalid) {
      this.zoneForm.markAllAsTouched();
      return;
    }
    const value = this.zoneForm.getRawValue();
    const id = this.editingZoneId();
    this.runSave(
      id ? this.adminService.updateFloodZone(id, value) : this.adminService.createFloodZone(value),
      'Zona inundable guardada'
    );
  }

  protected deleteZone(item: FloodZone): void {
    if (!confirm(`¿Eliminar la zona "${item.name}"?`)) return;
    this.runDelete(this.adminService.deleteFloodZone(item.id), 'Zona eliminada');
  }

  protected setVolunteerStatus(volunteer: Volunteer, status: VolunteerStatus): void {
    this.adminService
      .updateVolunteerStatus(volunteer.id, status)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.showSuccess(
            status === 'APPROVED' ? 'Voluntario aprobado' : 'Voluntario rechazado'
          );
          this.loadAll();
        },
        error: () => this.error.set('No se pudo actualizar el voluntario.')
      });
  }

  protected statusLabel(status: VolunteerStatus): string {
    return status === 'APPROVED'
      ? 'Aprobado'
      : status === 'REJECTED'
        ? 'Rechazado'
        : 'Pendiente';
  }

  protected severityLabel(severity: Severity): string {
    return severity === 'RED' ? 'Roja' : severity === 'YELLOW' ? 'Precaución' : 'Informativa';
  }

  protected formatDate(value: string): string {
    const date = new Date(value);
    return isNaN(date.getTime())
      ? value
      : date.toLocaleDateString('es-PE', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
  }

  private runSave(observable: any, message: string): void {
    this.saving.set(true);
    this.error.set(null);
    observable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.saving.set(false);
        this.showSuccess(message);
        this.resetForms();
        this.loadAll();
      },
      error: () => {
        this.saving.set(false);
        this.error.set('No se pudo guardar. Verifica los datos.');
      }
    });
  }

  private runDelete(observable: any, message: string): void {
    this.saving.set(true);
    observable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.saving.set(false);
        this.showSuccess(message);
        this.loadAll();
      },
      error: () => {
        this.saving.set(false);
        this.error.set('No se pudo eliminar el registro.');
      }
    });
  }

  private resetForms(): void {
    this.resetInventory();
    this.resetShelter();
    this.resetRoad();
    this.resetZone();
  }

  private showSuccess(message: string): void {
    this.success.set(message);
    setTimeout(() => this.success.set(null), 3500);
  }
}
