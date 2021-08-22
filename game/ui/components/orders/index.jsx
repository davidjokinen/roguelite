import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import GridMenu from '../map-editor/grid-menu';
import GridItem from '../map-editor/grid-item';

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: 'auto',
    maxWidth: 500,
  },
}));

export default function Orders(props) {
  const [selectedTab, setTab] = React.useState(0);
  const [optionMap, setOptionMap] = React.useState({});

  const { components, map, } = props;
  const classes = useStyles();

  const mapEditor = components['map-editor'];
  const updateTool = () => {
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
      target: 'action',
      type: newValue,
    };
    setOptionMap(newMap);
  }

  const handleChangeEntityOption = (event, newValue) => {
    const newMap = { ...optionMap };
    newMap[selectedTab] = {
      target: 'zones',
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
        <Tab label="Actions" />
        <Tab label="Zones" />
      </Tabs>
      <GridMenu onChange={handleChangeTileOption} selectedTab={selectedTab} index={0}>
        <GridItem type="chop"></GridItem>
        <GridItem type="cut"></GridItem>
        <GridItem type="haul"></GridItem>
        <GridItem type="harvest"></GridItem>
        <GridItem type="mine"></GridItem>
      </GridMenu>
      <GridMenu onChange={handleChangeEntityOption} selectedTab={selectedTab} index={1}>
        <GridItem type="storage"></GridItem>
        <GridItem type="food storage"></GridItem>
        <GridItem type="farm land"></GridItem>
        <GridItem type="area"></GridItem>
      </GridMenu>
    </Paper>
  );
}