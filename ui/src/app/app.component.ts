import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { API } from './model/api.model';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    api: API = window.parent['__madoc_opener']['madoc'];

    constructor (private router: Router) {

        switch (this.api.getAcao()) {
            case 'abrir':
                this.router.navigate(['abrir']);
                break;
            default:
                this.router.navigate(['tipos']);
        }


    }

}
