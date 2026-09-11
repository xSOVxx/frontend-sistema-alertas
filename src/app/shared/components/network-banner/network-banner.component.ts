import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetworkStatusService } from '@core/services/network-status.service';

@Component({
  selector: 'app-network-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './network-banner.component.html',
  styleUrl: './network-banner.component.css'
})
export class NetworkBannerComponent {
  protected readonly network = inject(NetworkStatusService);
}
