( function() {

  function insideTable(el) {
      if(!el || !el.is) return false;
      return el.getAscendant('table', true) != null;
  }

	CKEDITOR.plugins.add( 'ignoremenu', {
		init: function( editor ) {
			editor.addCommand( 'ignoremenu', { exec: function() { } } );
      editor.on( "contentDom", function() {
        editor.editable().on("contextmenu", function(ev) {
          var sel = editor.getSelection();
          if ( !(sel && !sel.isLocked) ) {
            return;
          }
          var el = sel.getStartElement();
          if (!insideTable(el)) {
            ev.cancel();
            ev.stop();
          }
        }, null, null, 1);
      });
    }
	} );

} )();
