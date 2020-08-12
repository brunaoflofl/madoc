(function() {
  CKEDITOR.plugins.add('customcontentfilter', {
    afterInit: function(editor) {
      var dataProcessor = editor.dataProcessor,
        dataFilter = dataProcessor && dataProcessor.dataFilter,
        htmlFilter = dataProcessor && dataProcessor.htmlFilter,

        const re = /[\x20-\x7f]|[\xa1-\xff]/gu;

      if (dataFilter) {
        dataFilter.addRules({
          text: function(text) {
            return text.replace(re, '');
          }
        });
      }

      if (htmlFilter) {
        htmlFilter.addRules({
          text: function(text) {
            return text.replace(re, '');
          }
        });
      }
    }
  });
})();
