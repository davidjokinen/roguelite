import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: 'auto',
    maxWidth: 500,
    height: 100,
  },
}));

export default function Inspector(props) {
  const classes = useStyles();

  return (<Paper className={classes.paper}>
      Inspector
    </Paper>)
}