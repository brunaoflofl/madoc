import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-madoc-title',
  template: `
    <div class="app-madoc-title panel panel-default">
      <div class="panel-heading">
        <div class="app-madoc-title-modelo">{{model}}</div>
        <div class="app-madoc-title-nome">{{name}}</div>
      </div>
    </div>
  `,
  styleUrls: ['./title.component.css']
})
export class TitleComponent {
  @Input() public model = '';
  @Input() public name = '';

  isDisabled(option) {
    return false;
  }
}
