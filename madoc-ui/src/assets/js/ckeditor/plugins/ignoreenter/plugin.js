( function() {
	CKEDITOR.plugins.add( 'ignoreenter', {
		init: function( editor ) {
			editor.addCommand( 'ignoreenter', { exec: function() { } } );
			if(!editor.config.keystrokes) editor.config.keystrokes = []; 			
			editor.config.keystrokes.push([13, 'ignoreenter']);
			editor.config.keystrokes.push([CKEDITOR.SHIFT + 13, 'ignoreenter']);
		}
	} );
} )();
