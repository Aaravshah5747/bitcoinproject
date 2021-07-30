const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );
$.getJSON("https://api.coindesk.com/v1/bpi/currentprice/usd.json", function( data) {
    var exchangeRate = parseInt(data.bpi.USD.rate_float);
    console.log("One bitcoin is worth " + exchangeRate + " " + "dollars");
});
//gives value of one bitcoin on US dollars
