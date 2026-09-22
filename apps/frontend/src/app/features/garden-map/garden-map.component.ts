import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Garden, GardenApiService } from '../gardens/garden-api.service';
import { GardenMapApiService, GardenTree, MapReferenceObject, TreeDetails } from './garden-map-api.service';

@Component({
  selector: 'app-garden-map',
  imports: [RouterLink, MatButtonModule, MatCardModule],
  templateUrl: './garden-map.component.html',
  styleUrl: './garden-map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GardenMapComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly gardensApi = inject(GardenApiService);
  private readonly mapApi = inject(GardenMapApiService);

  readonly garden = signal<Garden | undefined>(undefined);
  readonly trees = signal<readonly GardenTree[]>([]);
  readonly mapObjects = signal<readonly MapReferenceObject[]>([]);
  readonly selectedTree = signal<TreeDetails | undefined>(undefined);
  readonly error = signal<string | undefined>(undefined);
  readonly loading = signal(true);

  ngOnInit(): void {
    const gardenId = this.route.snapshot.paramMap.get('gardenId');
    if (!gardenId) {
      this.error.set('Не вдалося визначити сад для карти.');
      this.loading.set(false);
      return;
    }

    forkJoin({
      garden: this.gardensApi.getById(gardenId),
      trees: this.mapApi.getTrees(gardenId),
      mapObjects: this.mapApi.getMapObjects(gardenId),
    }).subscribe({
      next: ({ garden, trees, mapObjects }) => {
        this.garden.set(garden);
        this.trees.set(trees);
        this.mapObjects.set(mapObjects);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Не вдалося завантажити карту саду. Перевірте backend.');
        this.loading.set(false);
      },
    });
  }

  selectTree(tree: GardenTree): void {
    this.mapApi.getTree(tree.id).subscribe({
      next: (details) => this.selectedTree.set(details),
      error: () => this.error.set('Не вдалося завантажити відомості про дерево.'),
    });
  }

  coordinate(value: string | null): number {
    return Number(value ?? 0);
  }
}
