import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    // backgroundColor: 'gray',
    // height: '100vh',
    padding: theme.spacing(2),
    pointerEvents: 'all',
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    marginBottom: theme.spacing(2),
    maxWidth: 500,
  },
  header: {
    textAlign: 'center',
  },
  button: {
    margin: theme.spacing(2),
  },
}));

export default function Game(props) {
  const { changeScene } = props;
  const classes = useStyles();
  const startAction = () => { 
    changeScene('pause');
  };
  const settingsAction = () => { 
    alert('clicked settings') 
  };

  return (
    <div className={classes.root}>
      <Button variant="contained" className={classes.button} onClick={startAction}>Pause</Button>
    </div>
  );
}