import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import TabPanel from '../tab-panel';


const useStyles = makeStyles((theme) => ({
  grid: {
    minHeight: 150,
  },
}));

export default function GridMenu(props) {
  const { 
    selectedTab,
    children,
    onChange,
    index,
  } = props;
  const [selectedOption, setOption] = React.useState(null);
  const classes = useStyles();

  let childIndex = 0;
  const newChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) {
      return null;
    }

    const childValue = child.props.type === undefined ? childIndex : child.props.type;
    const selected = childValue === selectedOption;
    const childOnChange = (event, value) => {
      const newValue = selectedOption === value ? null : value;
      setOption(newValue);
      if (onChange) {
        onChange(event, newValue);
      }
    };

    childIndex += 1;
    return React.cloneElement(child, {
      selected,
      onChange: childOnChange,
      value: childValue,
    });
  });

  return (
    <TabPanel value={selectedTab} index={index}>
      <Grid className={classes.grid} container spacing={3}>
        {newChildren}
      </Grid>
    </TabPanel>
  );
}