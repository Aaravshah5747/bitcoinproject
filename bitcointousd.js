const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );
var prompt = require('prompt-sync')({sigint: true});
var num = prompt('Enter the bitcoin amount: ');
$.getJSON("https://api.coindesk.com/v1/bpi/currentprice/usd.json", function( data) {
   var amountInBitcoin = num; //convert num to usd
   var exchangeRate = parseInt(data.bpi.USD.rate_float);
   var amount = amountInBitcoin * exchangeRate;
   console.log(amount);
});


