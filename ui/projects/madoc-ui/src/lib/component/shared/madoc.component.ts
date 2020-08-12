import { Button } from '../../model/item/button/button';
import { IPageItem } from '../../model/iPageItem';
import { MadocStore } from './../../service/store.service';
import { MadocSectionComponent } from '../section/section.component';
import {
    AfterViewInit,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';

import { ComponentService } from '../../service/component.service';
import { MadocService } from '../../service/madoc.service';

@Component({
    selector: '@lexml/madoc-ui',
    template: ` <ng-container #madocPanel></ng-container> `,
})
export class MadocComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('madocPanel', { read: ViewContainerRef, static: true })
    madocPanel: ViewContainerRef;

    constructor(
        private madocService: MadocService,
        private componentService: ComponentService
    ) {}

    ngOnInit() {
        this.madocService.store$.subscribe((store) => {
            this.renderPage(store);
        });
    }

    ngAfterViewInit() {
        this.madocService.loaded = true;
    }

    ngOnDestroy() {
        this.destroyEditor();
        this.madocService.reset();
    }

    private renderPage(store: MadocStore) {
        this.render(this.madocPanel, store, store.getPageItems());
    }

    public render(
        viewContainerRef: ViewContainerRef,
        store: MadocStore,
        pageItems: IPageItem[]
    ) {
        if (pageItems != null && pageItems.length > 0) {
            pageItems.forEach((item) => {
                const componentRef = this.componentService.getComponentRef(
                    viewContainerRef,
                    store,
                    item
                );

                if (item instanceof Button) {
                    componentRef.instance['retorno$'].subscribe((actions) =>
                        store.execute(actions)
                    );
                } else {
                    componentRef.instance['retorno$'].subscribe((m) =>
                        store.update(m)
                    );
                }

                viewContainerRef.insert(componentRef.hostView);

                if (componentRef.instance instanceof MadocSectionComponent) {
                    const section: MadocSectionComponent =
                        componentRef.instance;
                    this.render(
                        section.viewContainerRef,
                        store,
                        section.item.questions
                    );
                }
            });
        }
    }

    destroyEditor(): void {
        const editor: Partial<any> = window['CKEDITOR'];
        if (editor.instances) {
            for (const editorInstance in editor.instances) {
                if (
                    editor.instances.hasOwnProperty(editorInstance) &&
                    editor.instances[editorInstance]
                ) {
                    editor.instances[editorInstance].destroy();
                    editor.instances[editorInstance] = {
                        destroy: () => true,
                    };
                }
            }
        }
    }
}
