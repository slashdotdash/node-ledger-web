// Collection Decorator For Aggregating many collections
// ----------------------------------

define(['underscore'], function(_) {
  function AggregateCollection(aggregateCollection, sourceCollections) {
      var aggregated = new aggregateCollection();
    
      // allow this object to have it's own events
      aggregated._callbacks = {};

      _.each(sourceCollections, function(collection) {
        aggregated.listenTo(collection, 'reset', function() {
          var models = _.flatten(_.map(sourceCollections, function(c) {
            return c.models;
          }));
          aggregated.reset(models);
        });

        // Add matching models to aggregated collection
        aggregated.listenTo(collection, 'add', function(model) {
          aggregated.add(model);
        });

        // Remove matching models from aggregated collection
        aggregated.listenTo(collection, 'remove', function(model) {
          aggregated.remove(model);
        });

        // Unsubscribe from all events when underlying collection is destroyed
        aggregated.listenToOnce(collection, 'destroy', function() {
          aggregated.stopListening(collection);
        });
      });
    
      return aggregated;
    }
  
  return AggregateCollection;
});