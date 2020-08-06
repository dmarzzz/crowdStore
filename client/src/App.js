import React, { useState } from 'react';
import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import { createPow, ffsOptions } from "@textile/powergate-client";
import { ethers } from "ethers";
import PushArtifact from "./contracts/Push.json"
import contractAddress from "./contracts/contract-address.json"
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import Container from '@material-ui/core/Container';
import clsx from 'clsx';
import {
    CreateToken,
    FilecoinBalancesList,
    CreateFilecoinAddress,
    SendAddressFilecoin,
    ButtonPrimary,
    CreateFilecoinStorageDeal
} from 'slate-react-system';
const BUIDLER_EVM_NETWORK_ID = '31337'
const ERROR_CODE_TX_REJECTED_BY_USER = 4001

const ethereum = window.ethereum;
// let provider;
let FFS;
const PowerGate = createPow({ host: 'http://0.0.0.0:6002' });



const useStyles = makeStyles((theme) => ({
    root: {
        height: '10%',
    },
    button: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    actionsContainer: {
        marginBottom: theme.spacing(2),
    },
    resetContainer: {
        padding: theme.spacing(3),
    },
    cardContainer: {
        display: 'flex',
        height: '100vmin',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#11BAA7',
    },
    InnerCard: {
        backgroundColor: '#282c34',
        color: 'white',
        paddingLeft: '3rem',
        paddingRight: '3rem',
        paddingBottom: '3rem',
        width: '50rem',
    }
}));

export default function App() {
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
    const [txHash, setTxHash] = useState(0)
    const [associateSuccess, setAssociateSuccess] = useState()
    //ipfs state
    const [proposalCID, setProposalCID] = useState()
    const [filAddr, setFilAddr] = useState()
    const [dealStatus, setDealStatus] = useState()

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
        const token = FFS.token ? FFS.token : null;
        PowerGate.setToken(token);
        setToken(token);
        const { info } = await PowerGate.ffs.info();
        setInfo(info);
        console.log(token)
        console.log("address mon", info.balancesList[0].addr.addr)
        setFilAddr(info.balancesList[0].addr.addr)

    }

    async function initializeEthers() {
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
            <h1> Connect dat wallet</h1>
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

            if (receipt.status === 0) {
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
        setAssociateSuccess(true)
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
            if (receipt.status === 0) {
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
    async function submitSpreadTxn(proposalCID) {
        console.log("sending to backend")
        axios.post(
            'http://localhost:3000/verifyStorageDeal?proposalCID=' + proposalCID + '&filecoinAddr=' + filAddr
        ).then(result => { setTxHash(result.data) })


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
        console.log("address mon", info.balancesList[0].addr.addr)
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
            console.log('cid is :', cid)
            console.log(job);
            setDealStatus(job.status)
            submitSpreadTxn(proposalCID)
        }, jobId);

    }
    /////////////////END POWERGATE CONNECTION///////////////////////////
    /////////////////END POWERGATE CONNECTION///////////////////////////

    /////////////////Start Material UI Stepper///////////////////////////
    /////////////////Start Material UI Stepper///////////////////////////
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    function getSteps() {
        return ['Welcome','Associate FileCoin -> Eth Address', 'Spread File', 'Confirm Transaction'];
    }

    function getStepContent(step) {
        switch (step) {
            case 0:
                return (
                    <div>
                        <Card style={{textAlign:'center'}} className={classes.InnerCard}>
                            <h1> Welcome to the Hacker's seed page!</h1>
                            <h4> Follow the instructions to spread our Jargon File</h4>
                            <h4> Our ethereum contract address is <span style={{color:'orange'}}> 0x7c2C195CD6D34B8F845992d380aADB2730bB9C6F </span> </h4>
                            <h4> Our jargon file CID is <span style={{color:'orange'}}> QmTcBpTJyhzsxG1n4SWBcwUWgKFvJ5JH5Bg5TsPri7pxNk </span> </h4>
                        </Card>
                    </div>

                )
            case 1:
                return (
                    <div>
                        <Card style={{textAlign:'center'}} className={classes.InnerCard}>
                            <h4> In order to receive your reward for spreading our cause you must associate your ethereum address and your filecoin address</h4>
                            <h4>  Eth Address : <br/> <span style={{color:'orange'}}> {Addr} </span> </h4>
                            <h4> Filecoin Address : <span style={{color:'orange'}}> {filAddr} </span> </h4>
                            <Button variant="contained" color="secondary" onClick={associateAddresses}>  ⟷ Associate Addresses ⟷ </Button>
                            <br />
                            {associateSuccess ? <h4> ✅ Awesome Association Made!</h4> : <div></div>}
                          

                        </Card>
                    </div>

                )

            case 2:
                return <div>
                    <Card  className={classes.InnerCard}>
                        <h4> Make Storage Deal </h4>
                        <div style={{color:'black'}}>
                            <CreateFilecoinStorageDeal onSubmit={handleSubmit} />
                        </div>
                        {dealStatus === 2 ? <h4> ✅ Nice Deal Made!</h4> : <div></div>}
                    </Card>
                </div>;
            case 3:
                return <div>
                    <Card className={classes.InnerCard}>
                        <h4> Verify your transaction by checking txHash on etherscan </h4>
                        <h4> txHash : <span style={{color:'orange'}}> {txHash} </span> </h4>
                    </Card>
                </div>
            default:
                return 'Unknown step';
        }
    }
    /////////////////End Material UI Stepper///////////////////////////
    /////////////////End Material UI Stepper///////////////////////////

    return (

            <div className={classes.cardContainer}>
                <div style={{width:'100%',position:'absolute', left:'43%', top:'5%',color:'white'}}>
                    <h1>Hacker's seedPage</h1>
                    </div>    
                <Card >
                    <Stepper activeStep={activeStep} orientation="vertical">
                        {steps.map((label, index) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                                <StepContent>
                                    <Typography>{getStepContent(index)}</Typography>
                                    <div className={classes.actionsContainer}>
                                        <div>
                                            <Button
                                                disabled={activeStep === 0}
                                                onClick={handleBack}
                                                className={classes.button}
                                            >
                                                Back
                    </Button>
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
                                </StepContent>
                            </Step>
                        ))}
                    </Stepper>
                </Card>
                {activeStep === steps.length && (
                    <Paper square elevation={0} className={classes.resetContainer}>
                        <Typography>All steps completed - you&apos;re finished</Typography>
                        <Button onClick={handleReset} className={classes.button}>
                            Reset
            </Button>
                    </Paper>
                )}
               
            </div>
        
    );

}

//ethers/web3 agnostic implementation
