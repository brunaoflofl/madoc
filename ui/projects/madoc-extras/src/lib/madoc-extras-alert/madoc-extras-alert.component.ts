import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MadocExtrasAlertService } from './madoc-extras-alert.service';

@Component({
  selector: 'madoc-extras-alert',
  template: `
    <div id="madoc-extras-alerts" [ngClass]="{'fixed-alerts': fixedPosition}">

        <alert _alert *ngFor="let alert of alerts;let i = index"
          [type]="alert.type"
          dismissible="true" dismissOnTimeout="6000"
          (close)="closeAlert(i)">
          {{ alert?.msg }}
        </alert>
    </div>
    `,
  styleUrls: ['madoc-extras-alert.component.css'],
})
export class MadocExtrasAlertComponent {

  alerts = [];

  @Input()
  fixedPosition = true;

  constructor(alertService: MadocExtrasAlertService) {
    alertService.message$.subscribe(a => a == null ? this.alerts = [] : this.addAlert(a.message, a.type, a.error));
  }

  closeAlert(i: number) {
    this.alerts.splice(i, 1);
  }

  private addAlert(msg: string, type: string, error?: any) {
    this.alerts.push({ 'msg': this.formatMessage(msg, error), 'type': type });
  }

  private formatMessage(msg: string, error?: any): string {
    if (error) {
      let errorMsg = error;
      if (error instanceof Response) {
        if (error.status) {
          errorMsg = `${error.status} - ${error.statusText}`;
        } else {
          errorMsg = 'Falha ao conectar com o servidor';
        }
      }
      return `${msg} (${errorMsg})`;
    }
    return msg;
  }

}
