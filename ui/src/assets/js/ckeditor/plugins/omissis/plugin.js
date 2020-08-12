(function () {

	function bloqueiaOmissis(event) {
		var lOmissis = event.editor.document.find('span.omissis'), count = lOmissis.count(), i;
		for (i = 0; i < count; i++) {
			lOmissis.getItem(i).$.contentEditable = false;
		}

	}

	function charAt(editor, offset) {
		return editor.document.$.body.innerText.substring(offset, offset + 1);
	}

	function insertOmissis(editor) {
		var spaces = '', i;
		for (i = 0; i < 8; i++) spaces += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
		editor.insertHtml('<span class="omissis" contenteditable="false">' + spaces + '</span>');
		var element = editor.getSelection().getStartElement();
		var range = editor.getSelection().getRanges()[0];
		range.setStartAfter(element);
		range.setEndAfter(element);
		editor.getSelection().selectRanges([range]);
	}

	CKEDITOR.plugins.add('omissis', {
		icons: 'omissis',
		hidpi: true,
		init: function (editor) {

			editor.addCommand('omissis', {
				exec: function () {
					insertOmissis(editor);
				}
			});

			editor.ui.addButton('Omissis', {
				label: 'Inserir Omissis',
				command: 'omissis',
				toolbar: 'insert,15'
			});

			editor.on('afterPaste', bloqueiaOmissis);

			editor.on('instanceReady', function (event) {

				bloqueiaOmissis(event);

				// Não gera atributo 'contenteditable'
				var editor = event.editor;
				var currentWriter = editor.dataProcessor.writer ?
					editor.dataProcessor.writer : new CKEDITOR.htmlParser.basicWriter();

				var writer = Object.create(currentWriter);
				writer.attribute_orig = writer.attribute;
				writer.attribute = function (attName, attValue) {
					if (attName == 'contenteditable') return;
					this.attribute_orig(attName, attValue);
				}

				editor.dataProcessor.writer = writer;

			});

			editor.on('key', function (event) {
				// Insere omissis automaticamente após o 4º '.'
				if (event.data.keyCode == 190 /* '.' */) {
					var editor = event.editor;
					var sel = editor.getSelection();
					var endOffset = sel.getRanges()[0].startOffset;
					var startOffset = endOffset - 1;
					var element = sel.getStartElement();
					var elementText = element.$.innerText;
					for (; startOffset >= 0 && elementText.charAt(startOffset) == '.'; startOffset--) { }
					for (; endOffset < elementText.length && elementText.charAt(endOffset) == '.'; endOffset++) { }
					if (endOffset - startOffset >= 4) {
						var ranges = editor.getSelection().getRanges();
						ranges[0].setStart(element.getFirst(), startOffset + 1);
						ranges[0].setEnd(element.getFirst(), endOffset);
						sel.selectRanges([ranges[0]]);
						insertOmissis(editor);
						event.cancel();
					}
				}
			})

		},
	});

})();
