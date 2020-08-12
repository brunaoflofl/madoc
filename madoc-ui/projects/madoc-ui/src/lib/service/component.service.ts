import { MadocMateriaComponent } from './../component/materia/materia.component';
import { MadocStore } from './store.service';

import {
    ComponentFactoryResolver,
    ComponentRef,
    Injectable,
    ViewContainerRef,
    Injector
} from '@angular/core';

import { IPageItem } from '../model/iPageItem';

import {
    MadocButtonComponent,
    MadocCheckboxComponent,
    MadocCheckBoxGroupComponent,
    MadocChoiceListComponent,
    MadocComboComponent,
    MadocConvidadoComponent,
    MadocDateComponent,
    MadocInputTextComponent,
    MadocMemoTextComponent,
    MadocNumberComponent,
    MadocDaterangeComponent,
    MadocRadioBoxGroupComponent,
    MadocRichTextComponent,
    MadocSectionComponent,
    MadocSignatarioComponent,
    MadocTextListComponent,
    MadocVetoComponent
} from '../component';
import { MadocMultiMateriaComponent } from '../component/multimateria/multimateria.component';

@Injectable()
export class ComponentService {
    constructor(private resolver: ComponentFactoryResolver) { }

    getComponentRef(
        viewContainerRef: ViewContainerRef,
        store: MadocStore,
        item: IPageItem
    ): ComponentRef<any> {
        const component = this.getComponent(item);

        const injector = Injector.create({
            providers: [{ provide: MadocStore, deps: [] }]
        });

        const factory = this.resolver.resolveComponentFactory(component);

        const componentRef = factory.create(injector);

        componentRef.instance['item'] = item;

        return componentRef;
    }

    private getComponent(item: IPageItem): any {
        switch (item.type) {
            case 'Section':
                return MadocSectionComponent;
            case 'AutoriaQuestion':
            case 'SignatarioQuestion':
                return MadocSignatarioComponent;
            case 'Button':
                return MadocButtonComponent;
            case 'CheckBoxQuestion':
                return MadocCheckboxComponent;
            case 'CheckBoxGroupQuestion':
                return MadocCheckBoxGroupComponent;
            case 'ChoiceListQuestion':
                return MadocChoiceListComponent;
            case 'ComboQuestion':
                return MadocComboComponent;
            case 'ConvidadoQuestion':
                return MadocConvidadoComponent;
            case 'DateQuestion':
                return MadocDateComponent;
            case 'DaterangeListQuestion':
                return MadocDaterangeComponent;
            case 'IntegerQuestion':
            case 'DecimalQuestion':
                return MadocNumberComponent;
            case 'InputTextQuestion':
                return MadocInputTextComponent;
            case 'MateriaQuestion':
                return MadocMateriaComponent;
            case 'MemoTextQuestion':
                return MadocMemoTextComponent;
            case 'RadioBoxGroupQuestion':
                return MadocRadioBoxGroupComponent;
            case 'RichTextQuestion':
                return MadocRichTextComponent;
            case 'TextListQuestion':
                return MadocTextListComponent;
            case 'DestaqueVetoQuestion':
                return MadocVetoComponent;
            case 'MultiMateriaQuestion':
                return MadocMultiMateriaComponent;
            default:
                return null;
        }
    }
}
