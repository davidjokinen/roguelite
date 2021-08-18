import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: 'gray',
    height: '100vh',
    padding: theme.spacing(2),
    pointerEvents: 'all',
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    marginBottom: theme.spacing(2),
    maxWidth: 500,
    borderImageSlice: 2,
    borderImageWidth: 2,
    borderImageRepeat: 'stretch',
    borderImageSource: `url('data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8" ?><svg version="1.1" width="5" height="5" xmlns="http://www.w3.org/2000/svg"><path d="M2 1 h1 v1 h-1 z M1 2 h1 v1 h-1 z M3 2 h1 v1 h-1 z M2 3 h1 v1 h-1 z" fill="rgb(33,37,41)" /></svg>')`,
    borderStyle: 'solid',
    borderWidth: 4,
    boxSizing: 'border-box',
  },
  header: {
    textAlign: 'center',
    fontFamily: "'Free Pixel', sans-serif",
  },
  button: {
    marginBottom: theme.spacing(2),
    fontFamily: "'Free Pixel', sans-serif",
  },
}));

export default function Title(props) {
  const { changeScene } = props;
  const classes = useStyles();
  const startAction = () => { 
    changeScene('game');
  };
  const settingsAction = () => { 
    alert('clicked settings') 
  };

  return (
    <Container maxWidth={false} className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant="h1" component="h2" className={classes.header}>
          Rougelite
        </Typography>
      </Paper>
      <Paper className={classes.paper}>
        <Button variant="contained" fullWidth={true} className={classes.button} onClick={startAction}>New Game</Button>
        <Button variant="contained" fullWidth={true} className={classes.button} onClick={settingsAction}>Settings</Button>
      </Paper>
    </Container>
  );
}