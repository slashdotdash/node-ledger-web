var _ = require('lodash'),
    express = require('express'),
    errorHandler = require('errorhandler'),
    logger = require('morgan'),
    methodOverride = require('method-override'),
    home = require('./routes/home'),
    http = require('http'),
    path = require('path'),
    engine = require('ejs-locals'),
    httpProxy = require('http-proxy'),
    LedgerRest = require('ledger-rest').LedgerRest;

var app = express();


var port = parseInt(process.env.PORT || 3000, 10);

app.set('port', port);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', engine);

app.use(logger('dev'));
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

var proxy = httpProxy.createProxyServer();

// Example ledger .dat file from the appendix of the Ledger 3 manual
var ledgerRest = new LedgerRest({ file: path.join(__dirname, 'example/example.dat') });

ledgerRest.listen(port + 1, function() {
console.log('Ledger REST server listening on port ' + port + 1);
});

// Proxy API requests to the ledger REST service
app.use('/api', function (req, res) {
proxy.web(req, res, { target: {
  host: 'localhost',
  port: port + 1
}});
});


if(process.env.NODE_ENV == 'development') {
  app.use(errorHandler());
}


var routes = [
  '/',
  '/income', '/income/*',
  '/spending', '/spending/*',
  '/worth', '/worth/*',
  '/balance', '/balance/*',
];

_.each(routes, function(route) {
  app.get(route, home.index);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});