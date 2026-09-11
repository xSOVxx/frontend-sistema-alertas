import { Component, input, output } from '@angular/core';
import { StockItem } from '../../models/voluntariado.model';

@Component({
  selector: 'app-stock-inventory',
  templateUrl: './stock-inventory.component.html',
  styleUrl: './stock-inventory.component.css'
})
export class StockInventoryComponent {
  readonly items = input.required<StockItem[]>();
  readonly refreshing = input<boolean>(false);
  readonly refresh = output<void>();

  protected onRefresh(): void {
    this.refresh.emit();
  }
}
