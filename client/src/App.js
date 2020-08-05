import React, { useState } from 'react';
import './App.css';
import {
  CreateToken,
  FilecoinBalancesList,
  CreateFilecoinAddress,
  SendAddressFilecoin,
  ButtonPrimary,
  CreateFilecoinStorageDeal
} from 'slate-react-system';
import { createPow, ffsOptions  } from "@textile/powergate-client";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import axios from 'axios';
import { ethers } from "ethers";
import PushArtifact from "./contracts/Push.json"
import contractAddress from "./contracts/contract-address.json"
import TextField from '@material-ui/core/TextField';

const BUIDLER_EVM_NETWORK_ID = '31337'
const ERROR_CODE_TX_REJECTED_BY_USER = 4001

// //connect to in memory blockchain
// const localProvider = new ethers.providers.JsonRpcProvider("http://localhost:8545");

// //connect to in mem blockchain thru metamask
// const provider = new ethers.providers.Web3Provider(window.ethereum)
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    top: '50%',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  storeCard: {
    position: 'absolute',
    minWidth: 500,
    minHeight: 350,
    left: '30%',
    top: '40%',
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));
//ethers/web3 agnostic implementation
const ethereum = window.ethereum;
// let provider;
let FFS;
const PowerGate = createPow({ host: 'http://0.0.0.0:6002' });

function App() {
  const [token, setToken] = useState()
  const [info, setInfo] = useState()
  const classes = useStyles()
  const [createDocStore, setCreateDocStore] = useState(false)
  const steps = getSteps()
  const [activeStep, setActiveStep] = React.useState(0)
  const [skipped, setSkipped] = React.useState(new Set())
  //eth state
  const [Addr, setAddr] = useState()
  const [provider, setProvider] = useState()
  const [TokenData, setTokenData] = useState()
  const [networkError, setNetworkError] = useState()
  const [txError, setTxError] = useState()
  const [txBeingSent, setTxBeingSent] = useState()
  const [getTestAddr, setTestAddr] = useState('1')
  //ipfs state
  const [proposalCID, setProposalCID]= useState()
  const [filAddr, setFilAddr] = useState()

  

  React.useEffect(() => {
    const windowProvider = async () => {
      if (typeof window.ethereum !== 'undefined'
        || (typeof window.web3 !== 'undefined')) {

        setProvider(window['ethereum'] || window.web3.currentProvider);

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

      try {
        FFS = await PowerGate.ffs.create();
        console.log("powergate stuff")
        console.log("FFS : ", FFS);
      }
      catch (e) {
        console.error("couldnt connect to powergate");
      }

    }
    windowProvider();
    powerInitialize();
  });
/////////////////START ETH CONNECTION///////////////////////////
/////////////////START ETH CONNECTION///////////////////////////

  if (ethereum) {
    ethereum.on('accountsChanged', function (accounts) {
      setAddr(accounts[0])
    })
  }

  async function connectWallet() {
    const tempAddr = await window.ethereum.enable()
    setAddr(tempAddr)
    if (!checkNetwork()) {
        return;
    }
    initializeEthers()

}

async function initializeEthers(){
  const provider3 = new ethers.providers.Web3Provider(window.ethereum)
  setProvider(provider3)
  const tokenTemp = new ethers.Contract(
      contractAddress.push,
      PushArtifact.abi,
      provider3.getSigner(0)
    )
    setTokenData(tokenTemp)
}

async function checkNetwork() {
  if (window.ethereum.networkVersion === BUIDLER_EVM_NETWORK_ID) {
      return true;
  }
  setNetworkError('Please connect Metamask to Localhost:8545')
  return false;
}

  if (!Addr) {
    return <div>
        <h1> Connect dat wallet boi </h1>
        <Button variant="contained" color="primary" onClick={() => connectWallet()} > Connect Wallet</Button>
    </div>
}

async function associateAddresses() {
  //const to = '0xead9c93b79ae7c1591b1fb5323bd777e86e150d4'
  try {
    setTxError('undefined')
  
    const tx = await TokenData.associateFiladdress(filAddr)
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

async function getAssociatedAddress() {
  try {
    const tempCID = await TokenData.getFiladdress(filAddr)
    console.log(tempCID.toNumber())
    setTestAddr(tempCID.toNumber())
  } catch (error) {
    console.log(error)
  }

}

async function mintFunc() {
  try {
    setTxError('undefined')
  
    const tx = await TokenData.mint(filAddr, proposalCID)
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
  submitSpreadTxn(proposalCID)
}


 //todo: put data in body
 async function submitSpreadTxn(proposalCID){
  const result = await axios.post(
    'http://localhost:3000/test?proposalCID='+ proposalCID +'&filecoinAddr='+filAddr
  );
}

/////////////////END ETH CONNECTION///////////////////////////
/////////////////END ETH CONNECTION///////////////////////////


/////////////////START POWERGATE CONNECTION///////////////////////////
/////////////////START POWERGATE CONNECTION///////////////////////////
  async function handleCreateToken() {
    // NOTE
    // Requires PowerGate to be running locally.

    const token = FFS.token ? FFS.token : null;
    PowerGate.setToken(token);
    setToken(token);
    const { info } = await PowerGate.ffs.info();
    setInfo(info);
    console.log(token)
    console.log("address mon" , info.balancesList[0].addr.addr)
    setFilAddr(info.balancesList[0].addr.addr)
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

  async function handleSend({ source, target, amount }) {
    console.log("Did this fire?")
    try {
      const response = await PowerGate.ffs.sendFil(
        source,
        target,
        amount
      );
      console.log("response be ", response)
    } catch (error) {
      console.error("Erroring sending coin", error)
    }
  }

  async function refresh() {
    const { info } = await PowerGate.ffs.info();
    setInfo(info);
  }

  //const [injectedProvider, setInjectedProvider] = useState();



  async function handleSubmit(data) {
    const file = data.file.files[0];
    var buffer = [];
    // NOTE(jim): A little hacky...
    const getByteArray = async () =>
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = function (e) {
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
/////////////////END POWERGATE CONNECTION///////////////////////////
/////////////////END POWERGATE CONNECTION///////////////////////////

  function getSteps() {
    return ['Generate new Powergate Token', 'Create Filecoin Address', 'Optional: Send Filecoin', 'Make Storage Deal'];
  }

  function getStepContent(step) {
    switch (step) {
      case 0:
        return <div>
          'Generate new Powergate Token'
                <CreateToken
            token={token}
            onClick={handleCreateToken} />
        </div>;
      case 1:
        return <div>
          'Create Filecoin Address'
        <CreateFilecoinAddress onSubmit={handleCreateAddress} />
        </div>;
      case 2:
        return <div>
          'Optional: Send Filecoin'
        <SendAddressFilecoin onSubmit={handleSend} />
        </div>;
      case 3:
        return <div>
          'Make Storage Deal'
        <CreateFilecoinStorageDeal onSubmit={handleSubmit} />
        </div>;
      default:
        return 'Unknown step';
    }
  }
  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  async function handleRefreshDealList() {
    const includeFinal = ffsOptions.withIncludeFinal(true);
    const includePending = ffsOptions.withIncludePending(true);
    const storageList = await PowerGate.ffs.listStorageDealRecords(
      includeFinal,
      includePending,
    );
    console.log(storageList[0].dealInfo.proposalCid);
    setProposalCID(storageList[0].dealInfo.proposalCid)
    submitSpreadTxn(storageList[0].dealInfo.proposalCid)

    // setStorageDealList(storageList);
  }




  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            CrowdStore 0.0.1
          </Typography>
          <Button onClick={() => { setCreateDocStore(true); console.log("docstore : ", createDocStore) }} color="inherit" >Create Doc Store</Button>
        </Toolbar>
      </AppBar>


      

        <Card className={classes.storeCard}>
          <CardContent>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
              Example CrowdStore 1
        </Typography>
            <Typography variant="h6">
              eth address : {Addr}
            </Typography>
            <Typography variant="h6">
              # of documents : 1
        </Typography>
        {/* <TextField id="filled-basic" label="fil Address" variant="filled" onChange={e => {console.log(e.target.value)}}/> */}
        <ButtonPrimary onClick={associateAddresses}> Associate Addresses </ButtonPrimary>
        <ButtonPrimary onClick={getAssociatedAddress}> Refresj Associate Addresses </ButtonPrimary>
          {getTestAddr}
          </CardContent>

        </Card>

        

        <div className={classes.root}>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              if (isStepOptional(index)) {
                labelProps.optional = <Typography variant="caption">Optional</Typography>;
              }
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          <div>
            {activeStep === steps.length ? (
              <div>
                <Typography className={classes.instructions}>
                  All steps completed - you&apos;re finished
            </Typography>
                <Button onClick={handleReset} className={classes.button}>
                  Reset
            </Button>
              </div>
            ) : (
                <div>
                  <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                  <div>
                    <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                      Back
              </Button>
                    {isStepOptional(activeStep) && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSkip}
                        className={classes.button}
                      >
                        Skip
                </Button>
                    )}

                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      className={classes.button}
                    >
                      {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                  </div>
                </div>
              )}
          </div>
          <br />
          <br />
          <br />
          <br />
          <h1>Address List</h1>
          <header className="App-header">
            <div style={{ 'color': '#000000', 'alignContent': 'center' }}>
              {info ? <FilecoinBalancesList data={info.balancesList} /> : null}
              <ButtonPrimary onClick={refresh}> Refresh </ButtonPrimary>
              <ButtonPrimary onClick={handleRefreshDealList}> Refresh Deals</ButtonPrimary>
            </div>
          </header>
        </div>
      
    </div>
  );
}

export default App;

{/* <p>
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
/> */}
