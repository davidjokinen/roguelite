import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import TileSelector from '../../components/tile-selector';
import TabPanel from '../../components/tab-panel';
import MapEditor from '../../components/map-editor';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    // backgroundColor: 'gray',
    // height: '100vh',
    // padding: theme.spacing(2),
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
  bottemLeft: {
    position: 'fixed',
    // margin: theme.spacing(2),
    bottom: '48px',
    left: '0px',
  },
  bottomRow: {
    position: 'fixed',
    // margin: theme.spacing(2),
    textAlign: 'center',
    bottom: '0px',
    // width: '100%',
    left: 'auto',
    right: 'auto',
  },
  topRow: {
    position: 'fixed',
    // margin: theme.spacing(2),
    textAlign: 'center',
    top: '0px',
    width: '100%',
    left: 'auto',
    right: 'auto',
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
      <Button variant="contained" className={classes.button} onClick={startAction}>Pause</Button>
      <Box className={classes.bottemLeft}>
        <TileSelector {...props} />
        {/* <TabPanel value={value} index={0}>
          Item One
        </TabPanel> */}
        <TabPanel value={value} index={1}>
          <MapEditor {...props} />
        </TabPanel>
        <TabPanel value={value} index={3}>
          Item Four
        </TabPanel>
      </Box>
      <Box className={classes.topRow}>
        Top Row
      </Box>
      <Box className={classes.bottomRow}>
        <Paper square>
          <Tabs
            value={value}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleChange}
            aria-label="disabled tabs example"
          >
            <Tab label="Inspect" />
            <Tab label="Build" />
            <Tab label="Disabled" disabled />
            <Tab label="Orders" />
          </Tabs>
        </Paper>
      </Box>
      
    </div>
  );
}