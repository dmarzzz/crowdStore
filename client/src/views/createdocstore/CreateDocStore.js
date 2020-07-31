import React, { useState, useEffect, useContext } from 'react';
import {
  CreateToken,
  FilecoinBalancesList,
  CreateFilecoinAddress,
  SendAddressFilecoin,
  ButtonPrimary,
  CreateFilecoinStorageDeal,
  FilecoinStorageDealsList,

} from 'slate-react-system';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
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
    left: '1.5%',
    top: '10%',
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

const CreateDocStore = (props) => {
  const [activeStep, setActiveStep] = React.useState(0)
  const [skipped, setSkipped] = React.useState(new Set())
  console.log(props)
  const steps = getSteps()

  const classes = useStyles()
  function getSteps() {
    return ['Generate new Powergate Token', 'Create Filecoin Address', 'Optional: Send Filecoin', 'Make Storage Deal'];
  }

  function getStepContent(step) {
    switch (step) {
      case 0:
        return <div>
          'Generate new Powergate Token'
                <CreateToken
            onClick={props.handleCreateToken}
            token={props.token}
          />

        </div>;
      case 1:
        return <div>
          'Create Filecoin Address'
        <CreateFilecoinAddress onSubmit={props.handleCreateAddress} />
        </div>;
      case 2:
        return <div>
          'Optional: Send Filecoin'
        <SendAddressFilecoin onSubmit={props.handleSend} />
        </div>;
      case 3:
        return <div>
          'Make Storage Deal'
        <CreateFilecoinStorageDeal onSubmit={props.handleSubmit} />
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
  return (
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
          {props.info ? <FilecoinBalancesList data={props.info.balancesList} /> : null}
          <ButtonPrimary onClick={props.refresh}> Refresh </ButtonPrimary>
        </div>
      </header>
      <div style={{ 'color': '#000000', 'alignContent': 'center' }}>

        {/*props.storageDealList.length !== 0 ? <FilecoinStorageDealsList data={props.storageDealList} /> : null*/}
        <ButtonPrimary onClick={props.handleRefreshDealList}> Refresh Deals</ButtonPrimary>


      </div>
    </div>);
}

export default CreateDocStore;