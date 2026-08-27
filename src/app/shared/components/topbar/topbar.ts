import { Component, input } from '@angular/core';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.html',
  styleUrl: './topbar.css'
})
export class Topbar {
  readonly title = input('');
}
