const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );

var prompt = require('prompt-sync')({sigint: true});
var num = prompt('Enter the bitcoin amount: ');
                                                                                                                                                                                            function convertToUSD(num) {
    $.getJSON("https://api.coindesk.com/v1/bpi/currentprice/usd.json", function( data) {
       var amountInBitcoin = num; //convert num to usd
       var exchangeRate = parseInt(data.bpi.USD.rate_float);
       var amount = amountInBitcoin * exchangeRate;
    console.log(amount);
//    return amount;
    const ResponseAndAmount = new Map()
    ResponseAndAmount.set(`status`, {
        desc: `OK This request is OK`,
        response: amount,
        status_code:200,
      });
//    ResponseAndAmount.set(200, amount)
    let jsonObject = {};
    ResponseAndAmount.forEach((value, key) => {
        jsonObject[key] = value
    });
    console.log(JSON.stringify(jsonObject));
    return(JSON.stringify(jsonObject));
    });
}
console.log(2)
convertToUSD(num)

//token: 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
