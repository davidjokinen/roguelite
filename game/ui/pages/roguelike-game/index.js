import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import TileSelector from '../../components/tile-selector';
import TabPanel from '../../components/tab-panel';
import Inspector from '../../components/inspector';
import MapEditor from '../../components/map-editor';
import ConstructionMenu from '../../components/construction-menu';
import Orders from '../../components/orders';
import Overlays from '../../components/overlays';

import ResourceCounter from '../../components/resource-counter';
import TimeControl from '../../components/time-control';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
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
    fontFamily: "'Free Pixel', sans-serif",
  },
  button: {
    margin: theme.spacing(2),
    fontFamily: "'Free Pixel', sans-serif",
  },
  bottemLeft: {
    position: 'fixed',
    bottom: '0px',
    left: '0px',
    padding: '10px',
  },
  bottomRow: {
    position: 'fixed',
    textAlign: 'center',
    width: '400px',
    bottom: '0px',
    left: 'auto',
    right: 'auto',
  },
  topRow: {
    position: 'fixed',
    textAlign: 'center',
    top: '0px',
    width: '100%',
    left: 'auto',
    right: 'auto',
  },
  topLeftRow: {
    display: 'flex',
    alignItems: 'center',
  },
  flexItem: {
    flex: '0 0 auto',
  },
  bar: {
    width: '200px',
    height: '10px',
    backgroundColor: '#666',
    display: 'inline-block',
  },
  barContainer: {

    height: '20px',
  }
}));

export default function Game(props) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    if (newValue === value)
      setValue(0);
    else
      setValue(newValue);
  };

  const { changeScene } = props;
  const classes = useStyles();
  const startAction = () => { 
    changeScene('pause');
  };

  return (
    <div className={classes.root}>
      <div className={classes.topLeftRow}>
        <div className={classes.flexItem}>
          <Button variant="contained" className={classes.button} onClick={startAction}>Pause</Button>
        </div>
      </div>
      {/* <ResourceCounter /> */}
      <Box className={classes.bottemLeft}>
        <div className={classes.barContainer}>
          <div className={classes.bar} style={{backgroundColor: '#F00'}}></div> 100/100
        </div>
        <div className={classes.barContainer}>
          <div className={classes.bar} style={{backgroundColor: '#0F0'}}></div> 100/100
        </div>
        <div className={classes.barContainer}>
          <div className={classes.bar} style={{backgroundColor: '#00F'}}></div> 100/100
        </div>
      </Box>
      {/* <Box className={classes.topRow}>
        Top Row
      </Box> */}
      <Box className={classes.bottomRow}>
        Test
      </Box>
      
    </div>
  );
}