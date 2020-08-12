(function() {
  CKEDITOR.plugins.add('customcontentfilter', {
    afterInit: function(editor) {
      var dataProcessor = editor.dataProcessor,
        dataFilter = dataProcessor && dataProcessor.dataFilter,
        htmlFilter = dataProcessor && dataProcessor.htmlFilter,
        re = /[\x00-\x1F]|[\x7f-\x9f]/gu;

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
