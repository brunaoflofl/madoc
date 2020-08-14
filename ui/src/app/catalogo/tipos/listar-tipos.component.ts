import { Component, OnInit } from '@angular/core';
import { TipoDocumento } from '../../model/tipo-documento-dto';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-madoc-listar-tipos',
    templateUrl: 'listar-tipos.component.html'
})

export class ListarTiposComponent implements OnInit {
    tipos;

    constructor(private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
        this.tipos = this.route.snapshot.data.tipos;
        if (this.tipos != null && this.tipos.length == 1) {
            this.navigate(this.tipos[0]);
        }
    }

    navigate(tipo: TipoDocumento) {
        this.router.navigate(['/modelos', tipo.label]);
    }
}
