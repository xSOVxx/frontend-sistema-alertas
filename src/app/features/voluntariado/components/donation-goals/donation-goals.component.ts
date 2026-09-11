import { Component, input } from '@angular/core';
import { GoalItem } from '../../models/voluntariado.model';

@Component({
  selector: 'app-donation-goals',
  templateUrl: './donation-goals.component.html',
  styleUrl: './donation-goals.component.css'
})
export class DonationGoalsComponent {
  readonly goals = input.required<GoalItem[]>();
}
