# ledger-web

Web front-end to access the Ledger command-line interface ([ledger-cli.org](http://ledger-cli.org/)).

> Ledger is a powerful, double-entry accounting system that is accessed from the UNIX command-line.

## Dependencies

  * [Ledger 3](http://ledger-cli.org/)
  * [Node.js](nodejs.org) and npm

### Installing Ledger

The simplest way to install Ledger 3 is through [Homebrew](http://mxcl.github.com/homebrew/).

    brew install ledger --HEAD

The `--HEAD` option is required to install version 3.x.

## Usage

Install `ledger-web` and its dependencies with npm.

    npm install ledger-web
    
Bower is used for JavaScript and CSS assets, once installed `npm install -g bower`, use to download the required dependencies.

    bower install
    
Finally, run the express application and open [http://localhost:3000/](http://localhost:3000/) in a web browser. 

    node app
    
By default it will start two http servers: one to listen on port 3000 for web requests; another on port 3001 for API requests.