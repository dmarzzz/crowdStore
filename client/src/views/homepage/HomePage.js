import React, { useState, useEffect, useContext } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';


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

const HomePage = props => {
  const classes = useStyles()

  return (
    <Card className={classes.storeCard}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Example CrowdStore 1
</Typography>
        <Typography variant="h6">
          eth address : {props.addr}
        </Typography>
        <Typography variant="h6">
          # of documents : 1
</Typography>
      </CardContent>

    </Card>);
}

export default HomePage;