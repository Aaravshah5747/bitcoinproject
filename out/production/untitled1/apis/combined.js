const axios = require("axios");
const bitcore = require("bitcore-lib");
var BtcToSatoshi = 100000000;
var crypto = require('crypto');
var request = require('request');
var apiKey = '';
var apiSecret = '';
var timestamp = Math.floor(Date.now() / 1000);
//var prompt = require('prompt-sync')({sigint: true});
//var transferType = prompt('Write one of the following: "BTC_BTC" or "BTC_USD": ')
const transfer = async (transferType, privateKey, sourceAddress, amountToSend, ReceiverAddress) => {
    //true if BTC_BTC
    if (transferType) {
    //    var privateKey = prompt("Enter your private key: ");
    //    var sourceAddress = prompt("Enter your source address: ");
    //    var amountToSend = prompt('Enter the amount you want to send: ')
    //    var ReceiverAddress = prompt('Enter your receiver address: ');


        const sendBitcoin = async (ReceiverAddress, amountToSend) => {
            const sochain_network = "BTCTEST";
            const satoshiToSend = amountToSend * BtcToSatoshi; //output is in satoshi and one bitcoin=100.000.000 satoshies
            let fee = 0;
            let inputCount = 0;
            let outputCount = 2;
            //use axios to get the api below, the api gets the unspent transactions of your bitcoin wallet
            const utxos = await axios.get(
            `https://sochain.com/api/v2/get_tx_unspent/${sochain_network}/${sourceAddress}`,
            );
            //bitcore library transaction
            const transaction = new bitcore.Transaction();
            let totalAmountAvailable = 0;

            let inputs = [];
            //utxos is unspent transaction output, GRAB the data from the array of unspent outputs and build a new input array
            utxos.data.data.txs.forEach(async (element) => {
                let utxo = {};
                //value of unspent outputs in your account in satoshis
                utxo.satoshis = Math.floor(Number(element.value) * BtcToSatoshi);
                //instruction on how to spend unspent outputs
                utxo.script = element.script_hex;
                //your wallet address
                utxo.address = utxos.data.data.address;
                //transaction ID in blockchain
                utxo.txId = element.txid;
                //index of EACH output in a transaction
                utxo.outputIndex = element.output_no;
                totalAmountAvailable += utxo.satoshis;
                inputCount += 1;
                inputs.push(utxo);
            });
            //formula for the transaction size, each input is 146 bytes and each output is 34 bytes. There are 2 outputs: the receiver and the sender

            transactionSize = inputCount * 146 + outputCount * 34 + 10 - inputCount;
            // Check if we have enough funds to cover the transaction and the fees assuming we want to pay 20 satoshis per byte
            fee = transactionSize * 20
            if (totalAmountAvailable - satoshiToSend - fee  < 0) {
            throw new Error('Balance is too low for this transaction');
            }
            console.log(`Your total amount of satoshis available before the transaction was: ${totalAmountAvailable} satoshis`);
            console.log(`The amount of satoshis you sent was: ${satoshiToSend} satoshis`);
            console.log(`The fee of the transaction was: ${fee} satoshis`);
            //Set transaction input
            transaction.from(inputs);
            // set the receiving address and the amount to send
            }
            if (satoshiToSend>0) {
                transaction.to(ReceiverAddress, Math.round(satoshiToSend));}
            else {
                console.log("negative value");
            }
            // Set change address - Address to receive the left over funds after transfer, You will get the change back
            transaction.change(sourceAddress);
            //manually set transaction fees: 20 satoshis per byte
            transaction.fee(fee);
            // Sign transaction with your private key
            transaction.sign(privateKey);
            // serialize Transactions
            const serializedTransaction = transaction.serialize();
            // Send transaction
            const result = await axios({
                method: "POST",
                url: `https://sochain.com/api/v2/send_tx/${sochain_network}`,
                data: {
                   tx_hex: serializedTransaction,
                },
            });
            return result.data.data;

        sendBitcoin(ReceiverAddress, amountToSend);
}
    else {
        var coinbase = require('coinbase');
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
                });
            });
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
    }
}
        // set the parameter for the request message
//        var req = {
//            method: 'GET',
//            path: '/v2/exchange-rates?currency=USD',
//            body: ''
//        };
//
//        var message = timestamp + req.method + req.path + req.body;
//        console.log(message);
//
//        //create a hexedecimal encoded SHA256 signature of the message
//        var signature = crypto.createHmac("sha256", apiSecret).update(message).digest("hex");
//
//        //create the request options object
//        var options = {
//            baseUrl: 'https://api.coinbase.com/',
//            url: req.path,
//            method: req.method,
//            headers: {
//                'CB-ACCESS-SIGN': signature,
//                'CB-ACCESS-TIMESTAMP': timestamp,
//                'CB-ACCESS-KEY': apiKey,
//                'CB-VERSION': '2015-07-22'
//            }
//        };
//
//        request(options,function(err, response){
//            if (err) console.log(err);
//            console.log(response.body);
//        });
//    }
//}
