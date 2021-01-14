const web3 = require('web3');
const express = require('express');
const Tx = require('ethereumjs-tx');

const app = express();
const axios = require('axios');
var cors = require('cors');
app.use(cors());

//http://127.0.0.1:8545


// var web3 = new Web3('http://localhost:8545');
// // or
// var web3js = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// change provider
// web3.setProvider('ws://localhost:8546');
// // or
// web3.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:8546'));

// // Using the IPC provider in node.js
// var net = require('net');
// var web3 = new Web3('/Users/myuser/Library/Ethereum/geth.ipc', net); // mac os path
// // or
// var web3 = new Web3(new Web3.providers.IpcProvider('/Users/myuser/Library/Ethereum/geth.ipc', net)); // mac os path
// // on windows the path is: "\\\\.\\pipe\\geth.ipc"
// // on linux the path is: "/users/myuser/.ethereum/geth.ipc"

//Infura HttpProvider Endpoint
web3js = new web3(new web3.providers.HttpProvider("http://localhost:8545"));


web3js.eth.getBalance("0xc783df8a850f42e7f7e57013759c285caa701eb6", function (err, result) {
  if (err) {
    console.log(err)
  } else {
    console.log(web3.utils.fromWei(result, "ether") + " ETH")
  }
})


async function mintDocRep() {
  const TokenArtifact = require("./contracts/Token.json");
  const contractAddress = require("./contracts/contract-address.json");

  var contract = new web3js.eth.Contract(TokenArtifact, contractAddress);
  console.log(contract);

}

app.get('/testTxn', async function (req, res) {
  const PushArtifact = require("./contracts/Push.json");
  const contractAddress = require("./contracts/contract-address.json");

  var contract = new web3js.eth.Contract(PushArtifact.abi, contractAddress.push);

  const result = await contract.methods.mint("0xc783df8a850f42e7f7e57013759c285caa701eb6").send({ from: "0xc783df8a850f42e7f7e57013759c285caa701eb6" });

  console.log(result);

  try {
    const result2 = await contract.methods;
    console.log(result2)
  } catch (error) {
    console.log(error)

  }
  // 
  // console.log(result2);
})

app.get('/sendtx', function (req, res) {

  var myAddress = 'ADDRESS_THAT_SENDS_TRANSACTION';
  var privateKey = Buffer.from('YOUR_PRIVATE_KEY', 'hex')
  var toAddress = 'ADRESS_TO_SEND_TRANSACTION';

  //contract abi is the array that you can get from the ethereum wallet or etherscan
  var contractABI = YOUR_CONTRACT_ABI;
  var contractAddress = "YOUR_CONTRACT_ADDRESS";
  //creating contract object
  var contract = new web3js.eth.Contract(contractABI, contractAddress);

  var count;
  // get transaction count, later will used as nonce
  web3js.eth.getTransactionCount(myAddress).then(function (v) {
    console.log("Count: " + v);
    count = v;
    var amount = web3js.utils.toHex(1e16);
    //creating raw tranaction
    var rawTransaction = { "from": myAddress, "gasPrice": web3js.utils.toHex(20 * 1e9), "gasLimit": web3js.utils.toHex(210000), "to": contractAddress, "value": "0x0", "data": contract.methods.transfer(toAddress, amount).encodeABI(), "nonce": web3js.utils.toHex(count) }
    console.log(rawTransaction);
    //creating tranaction via ethereumjs-tx
    var transaction = new Tx(rawTransaction);
    //signing transaction with private key
    transaction.sign(privateKey);
    //sending transacton via web3js module
    web3js.eth.sendSignedTransaction('0x' + transaction.serialize().toString('hex'))
      .on('transactionHash', console.log);

    contract.methods.balanceOf(myAddress).call()
      .then(function (balance) { console.log(balance) });
  })
});

app.post('/verifyStorageDeal', async function (req, res) {

  const proposalCID = req.query.proposalCID;
  const filecoinAddr = req.query.filecoinAddr;


  console.log(proposalCID);

  const Data = {
    "jsonrpc": "2.0",
    "method": "Filecoin.ClientGetDealInfo",
    "params": [{
      "/": req.query.proposalCID
    }],
    "id": 0
  };
  axios.post('http://localhost:7777/rpc/v0', Data).then(function (response) {
    console.log(response);
  })
 
  const PushArtifact = require("./contracts/Push.json");
  const contractAddress = require("./contracts/contract-address.json");

  var contract = new web3js.eth.Contract(PushArtifact.abi, contractAddress.push);

  //pull filecoin address from lotus query result
  const result = await contract.methods.mint(filecoinAddr, proposalCID ).send({ from: "0xc783df8a850f42e7f7e57013759c285caa701eb6" });
  
  console.log(result);

  res.send(result.transactionHash);

});


app.listen(3000, () => console.log('Example app listening on port 3000!'))





// curl -X POST \
//      -H "Content-Type: application/json" \
//      --data '{ "jsonrpc": "2.0", "method":"Filecoin.ClientGetDealInfo", "params": [{"/": "QmVudPstMmZbWwavbVgFpAn68TCdiAi1ebhxuwD2ZczchZ"}], "id": 0 }' \
//      'http://localhost:7777/rpc/v0'