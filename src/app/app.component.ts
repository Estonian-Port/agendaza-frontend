import { Component, OnDestroy, Optional } from '@angular/core';
import { routeAnimation } from './animations/route-animation';
import { ActivatedRoute } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [routeAnimation]
})
export class AppComponent implements OnDestroy {
  title = 'agendaza-frontend';
  updateAvailable = false;
  private updateCheckInterval?: number;

  constructor(
    protected route: ActivatedRoute,
    @Optional() private readonly swUpdate: SwUpdate | null
  ) {
    if (!swUpdate?.isEnabled) return;

    swUpdate.versionUpdates.subscribe(event => {
      if (event.type === 'VERSION_READY') this.updateAvailable = true;
    });

    this.checkForUpdates();
    this.updateCheckInterval = window.setInterval(() => this.checkForUpdates(), 6 * 60 * 60 * 1000);
  }

  ngOnDestroy(): void {
    if (this.updateCheckInterval !== undefined) window.clearInterval(this.updateCheckInterval);
  }

  async applyUpdate(): Promise<void> {
    await this.swUpdate?.activateUpdate().catch(() => undefined);
    (window.location as unknown as { reload: (forceGet?: boolean) => void }).reload(true);
  }

  private checkForUpdates(): void {
    void this.swUpdate?.checkForUpdate().catch(() => undefined);
  }
}
