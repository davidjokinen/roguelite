import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import TabPanel from './tab-panel';


const useStyles = makeStyles((theme) => ({
  paper: {
    margin: 'auto',
    maxWidth: 500,
  },
}));

export default function BuildSection(props) {
  const [selectedTab, setTab] = React.useState(0);
  const [selectedOption, setOption] = React.useState(null);

  const { components, map, } = props;
  const classes = useStyles();

  const mapEditor = components['map-editor'];
  React.useEffect(() => {
    // Send UI data out to be used when needed. 
    mapEditor.brush = {
      map: map,
      selectedTab: selectedTab,
      selectedOption: selectedOption,
    };
    return () => {
      mapEditor.brush = null;
    };
  }, [selectedTab, selectedOption]);

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
  };

  const tilesOptions = ['water', 'grass', 'dirt'].map(type => {
    const style = selectedOption === type ? {border: 'solid'} : {};
    return <div style={style} onClick={onOptionClick.bind(null, type)} key={type}>{type}</div>
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