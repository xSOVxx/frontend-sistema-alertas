import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NetworkBannerComponent } from '@shared/index';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NetworkBannerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  protected readonly title = signal('frontend-sistema-alertas');
}
