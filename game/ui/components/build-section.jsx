import React from 'react';

import { makeStyles } from '@material-ui/core/styles';


import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import TabPanel from './tab-panel';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: '100vh',
    // padding: theme.spacing(2),
    pointerEvents: 'all',
  },
  paper: {
    // padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 500,
  },
  header: {
    textAlign: 'center',
  },
  button: {
    marginBottom: theme.spacing(2),
  },
}));

export default function BuildSection(props) {
  const [mouseButton, setMouseButton] = React.useState(false);
  const [mousePos, setMouse] = React.useState({x:0, y:0});
  const [selectedTab, setTab] = React.useState(0);
  const [selectedOption, setOption] = React.useState(null);

  const { components, map, mouse } = props;
  const classes = useStyles();

  const tileSelector = components['tile-selector'];
  // console.log(this, selectedOption)
  let isActive = false;
  const makeActive = () => {
    setMouseButton(true);
  };
  const makeInactive = () => {
    setMouseButton(false);
  };
  let onMouseMove = (newMousePos) => {
    setMouse({x: newMousePos.screenX, y: newMousePos.screenY});
  };
  React.useEffect(() => {
    if (mouseButton && selectedOption) {
      const { cursorPoint } = tileSelector;
      let tile = null;
      if (cursorPoint) {
        tile = map.getTile(cursorPoint.x, cursorPoint.y);
      }
      if (tile) {
        if (tile.data.id === selectedOption)
          return;
        tile.updateType(selectedOption); 
        tile.entities.forEach(entity => entity.remove());
        tile.checkEdges(map);
        map.getNeighbors(tile.x, tile.y).forEach(tile2 => {
          tile2.checkEdges(map)
        });
      }
    }
  }, [mousePos, mouseButton]);

  React.useEffect(() => {
    console.log("Hello ",mouse);
    mouse.addOnClickDown(makeActive);
    mouse.addOnClickUp(makeInactive);
    mouse.addOnMove(onMouseMove);
    return () => {
      console.log("Bye");
      mouse.removeOnClickDown(makeActive);
      mouse.removeOnClickUp(makeInactive);
      mouse.removeOnMove(onMouseMove);
    };
  }, []);


  const settingsAction = () => { 
    alert('clicked settings') 
  };
  const titleAction = () => { 
    alert('clicked settings') 
  };


  const handleChange = (event, newValue) => {
    setTab(newValue);
    setOption(null);
  };

  const onOptionClick = (key) => {
    if (selectedOption === key) {
      setOption(null)
    } else {
      setOption(key)
    }
    
    console.log(arguments, key)
  };

  const tilesOptions = ['water', 'grass', 'dirt'].map(type => {
    return <div onClick={onOptionClick.bind(null, type)} key={type}>{type}</div>
  });

  return (
    <Paper className={classes.paper}>
      <Tabs
        value={selectedTab}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChange}
        aria-label="disabled tabs example"
      >
        <Tab label="Tiles" />
        <Tab label="Nature" />
        <Tab label="Disabled" disabled />
        <Tab label="Orders" />
      </Tabs>
      <TabPanel value={selectedTab} index={0}>
        {tilesOptions}
      </TabPanel>
      <TabPanel value={selectedTab} index={1}>
        Nature
      </TabPanel>
    </Paper>
  );
}