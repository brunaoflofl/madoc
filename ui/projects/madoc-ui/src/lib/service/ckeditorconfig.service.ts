/// <reference types="@types/ckeditor" />

import { Injectable } from '@angular/core';

@Injectable()
export class CkeditorConfigService {
  inlineToolbar = [
    {
      name: 'clipboard',
      items: [
        'Cut',
        'Copy',
        'Paste',
        'PasteText',
        'PasteFromWord',
        '-',
        'Undo',
        'Redo'
      ]
    },
    {
      name: 'basicstyles',
      items: [
        'Bold',
        'Italic',
        'Underline',
        'Subscript',
        'Superscript',
        '-',
        'RemoveFormat'
      ]
    },
    { name: 'insert', items: ['SpecialChar'] },
    {
      name: 'indentation', 
      items: ['Outdent', 'Indent']
    }
  ];

  // 'Table'
  defaultToolbar = [
    {
      name: 'clipboard',
      items: [
        'Cut',
        'Copy',
        'Paste',
        'PasteText',
        'PasteFromWord',
        '-',
        'Undo',
        'Redo'
      ]
    },
    {
      name: 'basicstyles',
      items: [
        'Bold',
        'Italic',
        'Underline',
        'Subscript',
        'Superscript',
        '-',
        'RemoveFormat'
      ]
    },
    { name: 'insert', items: ['Table', 'Omissis', 'SpecialChar'] },
    {
      name: 'paragraph',
      items: [
        'NumberedList',
        'BulletedList',
        '-',
        'JustifyLeft',
        'JustifyCenter',
        'JustifyRight',
        'JustifyBlock',
        '-',
        'Blockquote',
        'Outdent', 
        'Indent' 
      ]
    },
    { name: 'tools', items: ['Maximize'] }
  ];

  customValues = {
    CKEditorLegalCharacters: '\\u0020-\\u02AF\\'
  };

  inlineAllowedContent = 'strong em u sub sup;';

  defaultAllowedContent =
    this.inlineAllowedContent +
    `
      p (align-left,align-center,align-right,align-justify);
      blockquote ol ul li;
      span [contenteditable](omissis);
      table [border]{width};
      caption tbody thead tr;
      th td [colspan,rowspan]{width,vertical-align}(align-left,align-center,align-right,align-justify);
  `;

  defaultRemovePlugins = 'elementspath,scayt';

  defaultOption = Object.assign({
    toolbar: this.defaultToolbar,
    allowedContent: this.defaultAllowedContent,
    extraPlugins: 'customcontentfilter,tableresize,justify,omissis,ignoremenu',
    removePlugins: this.defaultRemovePlugins,
    on: {
      instanceReady: (e) => {
        e.editor.removeMenuItem('tablecell_properties');
      },
      beforeGetData: (e) => {
        this.trataTabelas(e.editor.document);
      }
    }
  });

  inlineOption = Object.assign({
    toolbar: this.inlineToolbar,
    allowedContent: this.inlineAllowedContent,
    extraPlugins: 'customcontentfilter,ignoreenter,ignoremenu',
    enterMode: 2,
    disallowedContent: 'br',
    removePlugins: this.defaultRemovePlugins + ',magicline,omissis',
    format_p: {element: 'p', attributes: { 'text-indent': '0', 'text-align': 'left' }},
    on: {
      afterPaste: (e) => {
      e.editor.setData(e.editor.getData().replace(/<br ?\/?>/, ''));
      }
    }
  });

  constructor() {}

  public getConfig(inline = true, lines = 10) {
    const obj = Object.assign({
      // customConfig: '/assets/js/ckeditor/config.js',
      startupFocus: false,
      height: Math.min(300, 50 + Math.max(lines, 1) * 13),
      language: 'pt-br',
      disableNativeSpellChecker: false,
      justifyClasses: ['align-left', 'align-center', 'align-right', 'align-justify'],
      specialChars: [
        '&sect;', '&lsquo;', '&rsquo;', '&ldquo;', '&rdquo;', '&euro;', '&pound;', '&yen;',
        '&cent;', '&laquo;', '&raquo;', '&ndash;', '&mdash;', '&iexcl;', '&iquest;', '&micro;', '&para;',
        '&copy;', '&reg;', '&trade;', '&ordm;', '&ordf;', '&deg;', '&sup1;', '&sup2;', '&sup3;',
        '&frac14;', '&frac12;', '&frac34;', '&AElig;', '&aelig;', '&OElig;', '&oelig;', '&hellip;',
        '&times;', '&divide;'
      ],
      entities: false,
      removeButtons: '',
      on: {
        dialogDefinition: this.configuraDialogos
      }
    });

    if (inline) {
      return Object.assign(obj, this.inlineOption);
    } else {
      return Object.assign(obj, this.defaultOption);
    }
  }


  trataTabelas(d: any) {
    const tabelas = d.find('table');
    const qtTabelas = tabelas.count();
    for (let i = 0; i < qtTabelas; i++) {
      const t = tabelas.getItem(i);

      // Garante largura relativa (%)
      const width: string = t.getStyle('width');
      if (width && !width.trim().endsWith('%')) {
        const tw = parseInt(t.getComputedStyle('width').replace('px', ''), 10);
        const tp = parseInt(
          t
            .getParent()
            .getComputedStyle('width')
            .replace('px', ''),
          10
        );
        const p: number = Math.round((tw / tp) * 100);
        t.setStyle('width', p + '%');
      }
    }
  }

  configuraDialogos(ev: any) {
    const dialogName = ev.data.name;
    const dialogDefinition = ev.data.definition;

    if (dialogName === 'table') {
      const infoTab = dialogDefinition.getContents('info');
      infoTab.get('txtCols')['default'] = '3';
      infoTab.get('txtWidth')['default'] = '80%';
      infoTab.get('cmbAlign')['default'] = 'center';
    } else if (dialogName === 'cellProperties') {
      dialogDefinition.minWidth = dialogDefinition.minWidth / 2;
      dialogDefinition.minHeight = dialogDefinition.minHeight / 3;

      const infoTab = dialogDefinition.getContents('info');
      const colunas = infoTab.elements[0];
      const c = colunas.children[0];
      colunas.widths = ['100%'];
      colunas.children = [c];
      c.children = [c.children[0]];

      infoTab.get('widthType')['default'] = '%';
      infoTab.get('widthType')['items'] = (<Array<any>>(
        infoTab.get('widthType')['items']
      )).filter(i => {
        return i[1] === '%';
      });
    }
  }
}
