import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-harvest-calendar',
  imports: [MatCardModule],
  template: `
    <section class="page">
      <h1>Календар збору</h1>
      <mat-card>
        <mat-card-content>
          <p>
            Приблизні періоди збору з’являться тут після підключення
            <code>GET /harvest-calendar</code> та фільтрів.
          </p>
        </mat-card-content>
      </mat-card>
    </section>
  `,
  styles: ['.page { max-width: 1080px; margin: 0 auto; padding: 2rem 1rem; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HarvestCalendarComponent {}
