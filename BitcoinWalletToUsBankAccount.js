var prompt = require('prompt-sync')({sigint: true});
var mykey = prompt("Enter your api key here: ");
var mysecret = prompt("Enter your api secret here: ");

//var SendOrRequest = prompt('Would you like to send or request money? Write one: "Send" or "Request": ');
var HowMuch = prompt('How much bitcoin would you like to transfer?: ')
var coinbase =  require('coinbase');
var client = new coinbase.Client({'apiKey': mykey, 'apiSecret': mysecret});
//get payment methods linked to your coinbase account
client.getPaymentMethods(function(err, paymentMethods) {
  console.log(paymentMethods);
});
//list available accounts
client.getAccounts({}, function(err, accounts) {
  accounts.forEach(function(acct) {
    console.log('my bal: ' + acct.balance.amount + ' for ' + acct.name);
  });
});
//get account balance from an Account ID
client.getAccount('primary', function(err, account) {
  console.log('bal: ' + account.balance.amount + ' currency: ' + account.balance.currency);
});
//sell bitcoin
client.getAccount('primary', function(err, account) {
    account.sell({'amount': parseInt(HowMuch),
                  'currency': 'BTC'}, function(err, sell) {
        console.log(sell);
}
//create new address for primary wallet
var address = null;

client.getAccount('primary', function(err, account) {
  account.createAddress(function(err, addr) {
    console.log(addr);
    address = addr;
  });
});
//send us dollars to an address
client.getAccount('primary', function(err, account) {
  account.sendMoney({'to': address,
                     'amount': parseInt(HowMuch),
                     'currency': 'USD'}, function(err, tx) {
    console.log(tx);
  });
});
