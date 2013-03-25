# ledger-web

Web front-end to access the Ledger command-line interface ([ledger-cli.org](http://ledger-cli.org/)).

> Ledger is a powerful, double-entry accounting system that is accessed from the UNIX command-line.

## Dependencies

Requires the Ledger to be installed, for Mac OS X using homebrew and latest 3.0 version.

    brew install ledger --HEAD

Uses the `ledger-cli` and `ledger-rest` npm packages.

## Usage

Install dependencies with npm.

    npm install ledger-web
    
Bower is used for JavaScript and CSS assets, once installed `npm install -g bower`, use to download the required dependencies.

    bower install
    
Finally, run the express application.

    node app