import React, { useState } from 'react';
import './App.css';
import { 
  CreateToken, 
  FilecoinBalancesList , 
  CreateFilecoinAddress ,
  SendAddressFilecoin , 
  ButtonPrimary ,
  CreateFilecoinStorageDeal } from 'slate-react-system';
import { createPow } from "@textile/powergate-client";

// import { ethers } from "ethers";

// //connect to in memory blockchain
// const localProvider = new ethers.providers.JsonRpcProvider("http://localhost:8545");

// //connect to in mem blockchain thru metamask
// const provider = new ethers.providers.Web3Provider(window.ethereum)

//ethers/web3 agnostic implementation
const ethereum = window.ethereum;
let provider;
let FFS;
const PowerGate = createPow({ host: 'http://0.0.0.0:6002' });

function App() {
  const [addr, setAddr] = useState()
  const [token, setToken] = useState()
  const [info, setInfo] = useState()

  React.useEffect(() => {
    const windowProvider = async () => {
      if (typeof window.ethereum !== 'undefined'
        || (typeof window.web3 !== 'undefined')) {

        provider = window['ethereum'] || window.web3.currentProvider;

        try {
          await provider.enable();
        } catch (e) {
          console.error('user refused to connect');
        }
        //console.log('network:', provider.networkVersion);
        //console.log('selectedAddress:', provider.selectedAddress);
        //console.log('is metamask:', provider.isMetaMask);
      }
    }
    const powerInitialize = async () => {

      try{
        FFS = await PowerGate.ffs.create();
        console.log("powergate stuff")
        console.log("FFS : ",  FFS);
      }
      catch(e){
        console.error("couldnt connect to powergate");
      }

    }
    windowProvider();
    powerInitialize();
  });


  async function handleCreateToken() {
    // NOTE
    // Requires PowerGate to be running locally.
    
    const token = FFS.token ? FFS.token : null;
    PowerGate.setToken(token);
    setToken(token);
    const { info } = await PowerGate.ffs.info();
    setInfo(info);
    console.log(token)
    console.log(info)
  }

  async function handleCreateAddress({ name, type, makeDefault }) {
    
    const token = FFS.token ? FFS.token : null;
    PowerGate.setToken(token);
    setToken(token);
    const response = await PowerGate.ffs.newAddr(
      name, 
      type, 
      makeDefault
    );
    console.log(response);
    const { info } = await PowerGate.ffs.info();
    setInfo(info);
  }

  async function handleSend({ source, target, amount }){
    console.log("Did this fire?")
    try {
      const response = await PowerGate.ffs.sendFil(
        source, 
        target, 
        amount
      );
      console.log("response be " , response)
    } catch (error) {
      console.error("Erroring sending coin", error)
    }
  }

  async function refresh(){
    const {info} = await PowerGate.ffs.info();
    setInfo(info);
  }

  //const [injectedProvider, setInjectedProvider] = useState();

  if (ethereum) {
    ethereum.on('accountsChanged', function (accounts) {
      setAddr(accounts[0])
    })
  }


  async function handleSubmit(data){
    const file = data.file.files[0];
    var buffer = [];
    // NOTE(jim): A little hacky...
    const getByteArray = async () =>
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = function(e) {
          if (e.target.readyState == FileReader.DONE) {
            buffer = new Uint8Array(e.target.result);
          }
          resolve();
        };
        reader.readAsArrayBuffer(file);
      });
    await getByteArray();
    // NOTE(jim):
    // For this example, my PG instance happens to be this.PG
    const { cid } = await PowerGate.ffs.addToHot(buffer);
    const { jobId } = await PowerGate.ffs.pushConfig(cid);
    const cancel = PowerGate.ffs.watchJobs((job) => {
      console.log(job);
    }, jobId);
  }


  return (
    <div className="App">
      <header className="App-header">
        <p>
          crowdStore prototype frontend
        </p>

        <p>
          Ethereum Address: {addr}
        </p>

        <label >
          Upload File:
        </label>
        <input
          accept="image/*"
          multiple
          type="file"
        />

        <CreateToken
          token={token}
          onClick={handleCreateToken} />
        <div style={{ 'color': '#000000' }}>
          {info ? <FilecoinBalancesList data={info.balancesList} /> : null}
        <ButtonPrimary onClick={refresh}> Refresh </ButtonPrimary>
        <CreateFilecoinAddress onSubmit={handleCreateAddress}/>
        <SendAddressFilecoin onSubmit={handleSend} />
        <CreateFilecoinStorageDeal onSubmit={handleSubmit} />
        
        </div>
      </header>

    </div>
  );
}

export default App;




// class Example extends React.Component {
//   state = {
//     token: null
//   }
//   _handleCreateToken = () => {
//     // NOTE
//     // Requires PowerGate to be running locally.
//     const PowerGate = createPow({ host: 'http://0.0.0.0:6002' });
//     const FFS = await PowerGate.ffs.create();
//     const token = FFS.token ? FFS.token : null;
//     PowerGate.setToken(token);
//   }
//   render() {
//     return (
//       <CreateToken 
//         token={this.state.token} 
//         onClick={this._handleCreateToken} />
//     );
//   }
// }