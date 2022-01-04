import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import TabPanel from '../tab-panel';


const useStyles = makeStyles((theme) => ({
  container: {
    width: '300px',
    padding: '3px',
    left: '50%',
    backgroundColor: '#FFF',
  },
}));

export default function PlayerToolbar(props) {

  const classes = useStyles();

  

  return (
    <div >
      <div className={classes.container}>
        Player ToolBar
      </div>
    </div>
  );
}