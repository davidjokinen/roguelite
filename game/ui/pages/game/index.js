import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import TileSelector from '../../components/tile-selector';

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

  return (
    <div className={classes.root}>
      <Button variant="contained" className={classes.button} onClick={startAction}>Pause</Button>
      <TileSelector {...props} />
    </div>
  );
}