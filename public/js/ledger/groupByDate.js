define(function() {
  var groupByDate = function(date) {
    return {
      // Get the time for the given date granularity to use for grouping dates together
      groupBy: function(granularity) {
  		  switch (granularity) {
          case 'month': return this.getMonth().getTime();
          case 'day': return this.getDate().getTime();
          case 'year': return this.getYear().getTime();
        }
      
        throw 'Date range granularity "' + granularity + '" is not supported';
      },
    
      getDate: function() {
        return date;
      },
    
      getMonth: function() {
        return new Date(date.getFullYear(), date.getMonth(), 1);
      },
      
      getYear: function() {
        return new Date(date.getFullYear(), 0, 1);
      }
    };
  }
  
  return groupByDate;
});