define(function() {
  var ControlNavigation = function(module, vent, router, section) {
    this.vent = vent;
    this.router = router;
    this.section = section;
    this.isActive = false;
    
    this.initialize(module);
  };
  
  ControlNavigation.prototype.initialize = function(module) {
    var self = this;
    
    module.listenTo(this.router, 'route', function(page) {
      self.vent.trigger('section:activated', {name: self.section});
    });

    module.listenTo(this.vent, 'section:activated', function(params) {
      self.isActive = (params.name === self.section);
    });

    // Update groupBy param in URL when changed
    module.listenTo(this.vent, 'controls:groupby', function(groupBy) {
      if (self.isActive === true) {
        self.router.navigate(self.section + '/' + groupBy.name, {trigger: false});
      }
    });
  };
  
  return ControlNavigation;  
});