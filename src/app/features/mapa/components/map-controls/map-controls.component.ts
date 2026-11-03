import { Component, output } from '@angular/core';

@Component({
  selector: 'app-map-controls',
  templateUrl: './map-controls.component.html',
  styleUrl: './map-controls.component.css'
})
export class MapControlsComponent {
  readonly locate = output<void>();
  readonly zoomIn = output<void>();
  readonly zoomOut = output<void>();
  readonly toggleLayer = output<void>();

  protected onLocate(): void {
    this.locate.emit();
  }

  protected onZoomIn(): void {
    this.zoomIn.emit();
  }

  protected onZoomOut(): void {
    this.zoomOut.emit();
  }

  protected onToggleLayer(): void {
    this.toggleLayer.emit();
  }
}
