import { Component, input, output } from '@angular/core';
import { AlertItem } from '../../models/alert.model';

@Component({
  selector: 'app-alert-card',
  templateUrl: './alert-card.component.html',
  styleUrl: './alert-card.component.css'
})
export class AlertCardComponent {
  readonly alert = input.required<AlertItem>();
  readonly open = output<AlertItem>();

  protected onAction(): void {
    this.open.emit(this.alert());
  }

  protected getWhatsAppShareUrl(): string {
    const item = this.alert();
    const text = encodeURIComponent(`🚨 *ALERTA COER PIURA*: ${item.title}\n\n${item.description ?? ''}\n\nConsulta más reportes en PonteAlerta Piura.`);
    return `https://wa.me/?text=${text}`;
  }

  protected getTelegramShareUrl(): string {
    const item = this.alert();
    const text = encodeURIComponent(`🚨 *ALERTA COER PIURA*: ${item.title}\n\n${item.description ?? ''}`);
    return `https://t.me/share/url?url=https://pontealerta.pe&text=${text}`;
  }
}
