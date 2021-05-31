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
  },
  header: {
    textAlign: 'center',
  },
  button: {
    marginBottom: theme.spacing(2),
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