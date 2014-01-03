define(function() {
  var DateRange = function(from, to) {
    this.from = from;
    this.to = to;
  };

  // Returns an array of dates between from and to.
  DateRange.prototype.between = function(granularity) {
    switch (granularity) {
      case 'year': return this.yearsBetween();
      case 'month': return this.monthsBetween();
      case 'day': return this.daysBetween();
    }
    
    throw 'Date range granularity "' + granularity + '" is not supported';
  };

  // Returns an array of years between from and to.
  DateRange.prototype.yearsBetween = function() {
    var current = this.from.getFullYear(),
        toYear = this.to.getFullYear(),
        range = [];

    while (current <= toYear) {
      range.push(new Date(current, 0, 1));

      // Move to the next year
      current += 1;
    }
    
    return range;
  };

  // Returns an array of months between from and to.
  DateRange.prototype.monthsBetween = function() {
    var current = new Date(this.from.getFullYear(), this.from.getMonth(), 1),
        toMonth = new Date(this.to.getFullYear(), this.to.getMonth(), 1),
        range = [];

    while (current <= toMonth) {
      range.push(current);

      // Move to the next month
      current = new Date(current);
      current.setMonth(current.getMonth() + 1);
    }
    
    return range;
  };

  // Returns an array of days between from and to.
  DateRange.prototype.daysBetween = function() {
    var current = this.from,
        range = [];
    
    while (current < this.to) {
      range.push(current);
      
      current = new Date(current);
      current.setDate(current.getDate() + 1);
    }
    
    return range;
  };

  return DateRange;
});