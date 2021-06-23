import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import TabPanel from '../tab-panel';


const useStyles = makeStyles((theme) => ({
  item: {
    minHeight: '30px',
    minWidth: '30px',
    backgroundColor: 'red',
    margin: '5px',
    padding: '5px',
    textAlign: 'center',
  },
}));

export default function GridItem(props) {
  const { 
    type,
    value,
    selected,
    onChange,
    onClick,
  } = props;
  const classes = useStyles();
  const style = selected ? {backgroundColor: 'blue'} : {};

  const handleClick = (event) => {
    if (onChange) {
      onChange(event, value);
    }

    if (onClick) {
      onClick(event);
    }
  };

  return (
    <Grid item xs={6} sm={3}>
      <div className={classes.item} style={style} onClick={handleClick}>{type}</div>
    </Grid>
  );
}