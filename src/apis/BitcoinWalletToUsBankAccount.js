var prompt = require('prompt-sync')({sigint: true});
var coinbase =  require('coinbase');


//var mykey = prompt("Enter your api key here: ");
//var mysecret = prompt("Enter your api secret here: ");
//
//var SendOrRequest = prompt('Would you like to send or request money? Write one: "Send" or "Request": ');
//var HowMuch = prompt('How much bitcoin would you like to transfer?: ')
//var client = new coinbase.Client({'apiKey': mykey, 'apiSecret': mysecret});

//get payment methods linked to your coinbase account
function getPaymentMethods(client) {
    client.getPaymentMethods(function(err, paymentMethods) {
      console.log(paymentMethods);
    });
    return paymentMethods;
}

//list available accounts
function getAccounts(client) {
    client.getAccounts({}, function(err, accounts) {
      accounts.forEach(function(acct) {
        console.log('my bal: ' + acct.balance.amount + ' for ' + acct.name);
      });
    });
}

//get account balance from an Account ID
function getAccountInfo(client) {
    client.getAccount('primary', function(err, account) {
      console.log('bal: ' + account.balance.amount + ' currency: ' + account.balance.currency);
    });
}

//sell bitcoin
function sellBitcoin(client) {
    client.getAccount('primary', function(err, account) {
        account.sell({'amount': parseInt(HowMuch),
                      'currency': 'BTC'}, function(err, sell) {
        console.log(sell);
    }
}

//create new address for primary wallet and send us dollars to an address
function sendMoney(mykey, mysecret, amount) {
    var client = new coinbase.Client({'apiKey': mykey, 'apiSecret': mysecret});

    paymentMethods = getPaymentMethods(client);
    getAccounts(client);
    getAccountInfo(client);
    sellBitcoin(client);
    var address = null;

    client.getAccount('primary', function(err, account) {
      account.createAddress(function(err, addr) {
        console.log(addr);
        address = addr;
      });
    });
    client.getAccount('primary', function(err, account) {
      account.sendMoney({'to': address,
                         'amount': parseInt(HowMuch),
                         'currency': 'USD'}, function(err, tx) {
        console.log(tx);
      });
    });
}
