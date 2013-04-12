// Collection Decorator For Filtering
// ----------------------------------

function FilteredCollection(original) {
    var filtered = new original.constructor();
    
    // allow this object to have it's own events
    filtered._callbacks = {};

    // call 'where' on the original function so that
    // filtering will happen from the complete collection
    filtered.where = function(criteria){
        var items;

        // call 'where' if we have criteria
        // or just get all the models if we don't
        if (criteria){
            items = original.filter(criteria);
        } else {
            items = original.models;
        }

        // store current criteria
        filtered._currentCriteria = criteria;
        
        // reset the filtered collection with the new items
        filtered.reset(items);
    };
    
    var matches = function(model) {
      return !filtered._currentCriteria || filtered._currentCriteria(model);
    };
    
    // when the original collection is reset,
    // the filtered collection will re-filter itself
    // and end up with the new filtered result set
    filtered.listenTo(original, 'reset', function() {
      filtered.where(filtered._currentCriteria);
    });
    
    // Add matching models to filtered collection
    filtered.listenTo(original, 'add', function(model) {
      if (matches(model)) {
        filtered.add(model);
      }
    });

    // Remove matching models from filtered collection
    filtered.listenTo(original, 'remove', function(model) {
      if (matches(model)) {
        filtered.remove(model);
      }
    });

    filtered.listenTo(original, 'change', function(model) {
      // TODO: Add item if now matches (and not already in filtered list).
      // Or remove item if no longer matches (and exists in filtered list).
    });
    
    // Unsubscribe from all events when underlying collection is destroyed
    filtered.listenToOnce(original, 'destroy', function() {
      console.log('destroyed');
      filtered.stopListening(original);
    });
    
    return filtered;
}