import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import GridMenu from './map-editor/grid-menu';
import GridItem from './map-editor/grid-item';

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: 'auto',
    maxWidth: 500,
  },
}));

export default function ConstructionMenu(props) {
  const [selectedTab, setTab] = React.useState(0);
  const [optionMap, setOptionMap] = React.useState({});

  const { components, map, } = props;
  const classes = useStyles();

  const mapEditor = components['map-editor'];
  const updateTool = () => {
    // TODO
    // alert('todo');
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
        <Tab label="Items" />
        <Tab label="Walls" />
        <Tab label="Floors" />
      </Tabs>
      <GridMenu onChange={handleChangeTileOption} selectedTab={selectedTab} index={0}>
        <GridItem type="bed"></GridItem>
        <GridItem type="camp-fire"></GridItem>
        <GridItem type="chair"></GridItem>
      </GridMenu>
      <GridMenu onChange={handleChangeEntityOption} selectedTab={selectedTab} index={1}>
        <GridItem type="wood wall"></GridItem>
        <GridItem type="stone wall"></GridItem>
      </GridMenu>
      <GridMenu onChange={handleChangeEntityOption} selectedTab={selectedTab} index={2}>
        <GridItem type="dirt path"></GridItem>
        <GridItem type="wood floor"></GridItem>
        <GridItem type="stone floor"></GridItem>
      </GridMenu>
    </Paper>
  );
}