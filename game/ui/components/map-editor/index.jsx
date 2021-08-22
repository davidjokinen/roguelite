import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import GridMenu from './grid-menu';
import GridItem from './grid-item';

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: 'auto',
    maxWidth: 500,
  },
}));

export default function MapEditor(props) {
  const [selectedTab, setTab] = React.useState(0);
  const [optionMap, setOptionMap] = React.useState({});

  const { components, map, } = props;
  const classes = useStyles();

  const mapEditor = components['map-editor'];
  const updateTool = () => {
    // Send UI data out to be used when needed. 
    mapEditor.tool = {
      map: map,
      brush: optionMap[selectedTab],
    };
  }

  React.useEffect(() => {
    updateTool();
    return () => {
      mapEditor.tool = null;
    };
  }, [selectedTab, optionMap]);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleChangeTileOption = (event, newValue) => {
    const newMap = { ...optionMap };
    newMap[selectedTab] = {
      target: 'tile',
      type: newValue,
    };
    setOptionMap(newMap);
  }

  const handleChangeEntityOption = (event, newValue) => {
    const newMap = { ...optionMap };
    newMap[selectedTab] = {
      target: 'entity',
      type: newValue,
    };
    setOptionMap(newMap);
  }

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
        <Tab label="Items" />
        <Tab label="NPC" />
      </Tabs>
      <GridMenu onChange={handleChangeTileOption} selectedTab={selectedTab} index={0}>
        <GridItem type="water"></GridItem>
        <GridItem type="grass"></GridItem>
        <GridItem type="dirt"></GridItem>
        <GridItem type="sand"></GridItem>
        <GridItem type="stone"></GridItem>
        <GridItem type="dirt-path"></GridItem>
        <GridItem type="sand-path"></GridItem>
        <GridItem type="stone-path"></GridItem>
      </GridMenu>
      <GridMenu onChange={handleChangeEntityOption} selectedTab={selectedTab} index={1}>
        <GridItem type="delete"></GridItem>
        <GridItem type="tree"></GridItem>
        <GridItem type="small-tree"></GridItem>
        <GridItem type="grass"></GridItem>
        <GridItem type="berry-bush"></GridItem>
        <GridItem type="bush"></GridItem>
        {/* <GridItem type="long-bush"></GridItem> */}
        <GridItem type="rock"></GridItem>
        <GridItem type="dead-tree"></GridItem>
        <GridItem type="small-dead-tree"></GridItem>
      </GridMenu>
      <GridMenu onChange={handleChangeEntityOption} selectedTab={selectedTab} index={2}>
        <GridItem type="bed"></GridItem>
        <GridItem type="berry-pile"></GridItem>
        <GridItem type="wood-pile"></GridItem>
        <GridItem type="stone-pile"></GridItem>
      </GridMenu>
      <GridMenu onChange={handleChangeEntityOption} selectedTab={selectedTab} index={3}>
        <GridItem type="npm-wander"></GridItem>
        <GridItem type="npm-sim"></GridItem>
      </GridMenu>
    </Paper>
  );
}