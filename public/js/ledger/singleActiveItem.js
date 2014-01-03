define(function() {
  // Ensure only one model in the collection is active at any time
  var activeToggled = function(model, value) {
    if (value === true) {
      this.forEach(function(m) {
        if (m.get('active') === true && m !== model) {
          m.set('active', false);
        }
      });
    }
  };

  return function(collection) {
    collection.listenTo(collection, 'change:active', activeToggled, collection);
  };
});