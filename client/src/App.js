import React , {useState} from 'react';
import './App.css';
// import { ethers } from "ethers";

// //connect to in memory blockchain
// const localProvider = new ethers.providers.JsonRpcProvider("http://localhost:8545");

// //connect to in mem blockchain thru metamask
// const provider = new ethers.providers.Web3Provider(window.ethereum)

//ethers/web3 agnostic implementation
const ethereum = window.ethereum; 
let provider;

function App() {


  React.useEffect(() => {
    const windowProvider = async() => {
      if (typeof window.ethereum !== 'undefined'
          || (typeof window.web3 !== 'undefined')) {

          provider = window['ethereum'] || window.web3.currentProvider;

          try{
             await provider.enable();
          }catch (e){
              console.error('user refused to connect');
          }
          //console.log('network:', provider.networkVersion);
          //console.log('selectedAddress:', provider.selectedAddress);
          //console.log('is metamask:', provider.isMetaMask);
        }
      }
      windowProvider();
  });


  const [addr, setAddr] = useState()
  //const [injectedProvider, setInjectedProvider] = useState();

  if(ethereum){
    ethereum.on('accountsChanged', function(accounts){
      setAddr(accounts[0])
    })
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
      </header>
    </div>
  );
}

export default App;
