import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Garden, GardenApiService } from './garden-api.service';

@Component({ selector: 'app-garden-list', imports: [ReactiveFormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule], templateUrl: './garden-list.component.html', styleUrl: './garden-list.component.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class GardenListComponent implements OnInit {
  private readonly api = inject(GardenApiService);
  private readonly formBuilder = inject(FormBuilder);
  readonly gardens = signal<readonly Garden[]>([]);
  readonly error = signal<string | undefined>(undefined);
  readonly saving = signal(false);
  readonly form = this.formBuilder.nonNullable.group({ name: ['', [Validators.required, Validators.maxLength(120)]], widthMeters: [10, [Validators.required, Validators.min(0.01)]], heightMeters: [10, [Validators.required, Validators.min(0.01)]], description: [''] });
  ngOnInit(): void { this.load(); }
  load(): void { this.api.getAll().subscribe({ next: (gardens) => this.gardens.set(gardens), error: () => this.error.set('Не вдалося завантажити сади. Перевірте backend.') }); }
  create(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const value = this.form.getRawValue(); this.saving.set(true); this.error.set(undefined);
    this.api.create({ name: value.name.trim(), description: value.description.trim() || undefined, widthMeters: value.widthMeters, heightMeters: value.heightMeters }).subscribe({ next: (garden) => { this.gardens.update((items) => [...items, garden]); this.form.reset({ name: '', widthMeters: 10, heightMeters: 10, description: '' }); }, error: () => this.error.set('Не вдалося створити сад.'), complete: () => this.saving.set(false) });
  }
}
