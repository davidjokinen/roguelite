import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
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
    margin: theme.spacing(2),
  },
}));

export default function Pause(props) {
  const { changeScene, backToGame } = props;
  const classes = useStyles();
  const startAction = () => { 
    changeScene(backToGame());
  };
  const settingsAction = () => { 
    alert('clicked settings') 
  };
  const titleAction = () => { 
    changeScene('title');
  };

  return (
    <Container maxWidth={false} className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant="h1" component="h2" className={classes.header}>
          Pause
        </Typography>
      </Paper>
      <Paper className={classes.paper}>
        <Button variant="contained" className={classes.button} onClick={startAction}>Back to Game</Button>
        <Button variant="contained" className={classes.button} onClick={settingsAction}>Settings</Button>
        <Button variant="contained" className={classes.button} onClick={titleAction}>Exit to Title Screen</Button>
      </Paper>
    </Container>
  );
}