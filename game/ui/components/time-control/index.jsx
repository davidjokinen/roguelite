import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import FastForwardIcon from '@material-ui/icons/FastForward';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';


const useStyles = makeStyles((theme) => ({
  button: {
    padding: 5,
    color: 'black',
  },
  buttonGroup: {
    backgroundColor: 'white', 
  }
}));

export default function TimeControl(props) {
  const [timeState, setTimeState] = React.useState('play');

  const classes = useStyles();

  const handleTimeState = (event, newTimeState) => {
    setTimeState(newTimeState);
  };

  return (
    <ToggleButtonGroup
      value={timeState}
      exclusive
      onChange={handleTimeState}
      aria-label="Time Control"
      className={classes.buttonGroup}
    >
      <ToggleButton className={classes.button} value="pause" aria-label="pause">
        <PauseIcon />
      </ToggleButton>
      <ToggleButton className={classes.button} value="play" aria-label="play">
        <PlayArrowIcon />
      </ToggleButton>
      <ToggleButton className={classes.button} value="fast" aria-label="fast">
        <FastForwardIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}