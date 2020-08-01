import React, { useState } from "react"
import { ethers } from "ethers"
import TokenArtifact from "./contracts/Token.json"
import contractAddress from "./contracts/contract-address.json"

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
const BUIDLER_EVM_NETWORK_ID = '31337'
const ERROR_CODE_TX_REJECTED_BY_USER = 4001




export default function Dapp2() {
    const [TokenData, setTokenData] = useState()
    const [Addr, setAddr] = useState()
    const [balance, setBalance] = useState()
    const [txBeingSent, setTxBeingSent] = useState()
    const [txError, setTxError] = useState()
    const [networkError, setNetworkError] = useState()
    const [provider, setProvider] = useState()
    const [provider2, setProvider2] = useState()
    const [CID, setCID] = useState()
    const [storedCID, setStoredCID] = useState()

    React.useEffect(() => {
        const windowProvider = async () => {
            if (typeof window.ethereum !== 'undefined'
                || (typeof window.web3 !== 'undefined')) {
                setProvider2(window['ethereum'] || window.web3.currentProvider)
                try {
                    await provider2.enable()
                } catch (e) {
                    console.error('user refused to connect')
                }
            }
        }
        windowProvider();
    });


    //show connect wallet button if no address found
    if (!Addr) {
        return <div>
            <h1> Connect dat wallet boi </h1>
            <Button variant="contained" color="primary" onClick={() => connectWallet()} > Connect Wallet</Button>
        </div>
    }

    //load main application once wallet connected
    return (
        <div>
            <h1>Test</h1>
            {txBeingSent && (<div> <h1> Transaction being sent</h1> </div>)}
            {txError && (<div> <h1> Transaction error : {txError}</h1> </div>)}
            <TextField onChange={e=>{setCID(e.target.value)}} id="cid" label="Enter CID" variant="filled" />
            <Button variant="contained" color="secondary" onClick={()=>{sendCID(CID)}} > Submit </Button>
            <Button variant="contained" color="primary" onClick={()=>{getCID()}}> getCID </Button>
            
            {storedCID && (<div>  <br/> Stored CID is : {storedCID} </div> )}
        
        </div>
    );

    async function connectWallet() {
        const tempAddr = await window.ethereum.enable()
        setAddr(tempAddr)
        if (!checkNetwork()) {
            return;
        }
        initializeEthers()

    }

    async function checkNetwork() {
        if (window.ethereum.networkVersion === BUIDLER_EVM_NETWORK_ID) {
            return true;
        }
        setNetworkError('Please connect Metamask to Localhost:8545')
        return false;
    }

    async function initializeEthers(){
        const provider3 = new ethers.providers.Web3Provider(window.ethereum)
        setProvider(provider3)
        const tokenTemp = new ethers.Contract(
            contractAddress.Token,
            TokenArtifact.abi,
            provider3.getSigner(0)
          )
          setTokenData(tokenTemp)
    }

    async function sendCID(amount) {
        //const to = '0xead9c93b79ae7c1591b1fb5323bd777e86e150d4'
        try {
          setTxError('undefined')
        
          const tx = await TokenData.set(amount)
          setTxBeingSent(tx.hash)
          const receipt = await tx.wait()
          if(receipt.status === 0){
              throw new Error("Tx failed")
          }
        } catch (error) {
          if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
            return;
          }
          console.error(error);
          setTxError({ transactionError: error });
        } finally {
          setTxBeingSent({ txBeingSent: undefined });
        }
      }

    async function getCID(){
        try {
            console.log(Addr[0])
            const tempCID = await TokenData.get()
            console.log(tempCID.toNumber())
            setStoredCID(tempCID.toNumber())
            // setStoredCID(tempCID)
        } catch (error) {
            console.log(error)
        } 
    }
}