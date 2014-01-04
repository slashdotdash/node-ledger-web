
var environment = process.env.NODE_ENV || 'development';

exports.index = function(req, res) {
  res.render('home', { title: 'Ledger Web', environment: environment });
};