import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import TabPanel from '../tab-panel';


const useStyles = makeStyles((theme) => ({
  container: {
    padding: '3px',
    backgroundColor: '#FFFFFFCC',
  },
  playerName: {
    padding: '3px',
    backgroundColor: '#FFFFFFCC',
    width: 'min-content',
    minWidth: '50px',
    whiteSpace: 'nowrap',
  },
  bar: {
    width: '200px',
    height: '8px',
    backgroundColor: '#666',
    transition: 'width .1s',
  },
  sectionContainer: {
    height: '14px',
  },
  barContainer: {
    width: '200px',
    height: '8px',
    marginTop: '2px',
    marginRight: '4px',
    backgroundColor: '#DDD',
    display: 'inline-block',
  }
}));

export default function PlayerStatus(props) {

  const { components, } = props;
  const classes = useStyles();

  const playerService = components['player'];
  const [health, setHealth] = React.useState(0);
  const [healthMax, setHealthMax] = React.useState(0);
  const [pp, setPP] = React.useState(0);
  const [ppMax, setPPMax] = React.useState(0);
  const [player, setPlayer] = React.useState(playerService.player);
  const [playerHealthComponent, setPlayerHealthComponent] = React.useState(null);

  const updateHealth = (healthComponent) => {
    healthComponent = healthComponent || playerHealthComponent;
    if (!healthComponent) return;
    setHealth(healthComponent.health);
    setHealthMax(healthComponent.maxHealth);
  }

  const updatePP = (healthComponent) => {
    healthComponent = healthComponent || playerHealthComponent;
    if (!healthComponent) return;
    setPP(healthComponent.pp);
    setPPMax(healthComponent.maxPP);
  }

  const updateHealthComponent = (newPlayer) => {
    const newComponent = newPlayer ? newPlayer.getComponent('HealthComponent') : null;
    if (playerHealthComponent) {
      playerHealthComponent.removeOnHealthChange(updateHealth);
      playerHealthComponent.removeOnPPChange(updatePP);
    }
    setPlayerHealthComponent(newComponent);
    if (newComponent) {
      newComponent.addOnHealthChange(updateHealth);
      newComponent.addOnPPChange(updatePP);
      updateHealth(newComponent);
      updatePP(newComponent);
    }
  }

  const onPlayerChange = (newPlayer) => {
    setPlayer(newPlayer);
    updateHealthComponent(newPlayer);
  }
  
  React.useEffect(() => {
    playerService.addOnPlayerChange(onPlayerChange);
    updateHealthComponent(player);
    return () => {
      playerService.removeOnPlayerChange(onPlayerChange);
    };
  }, [player, playerHealthComponent]);

  if (!player || !playerHealthComponent) {
    return <div></div>;
  }

  let healthWidth = health/healthMax;
  if (healthWidth > 1) healthWidth = 1;
  if (healthWidth < 0) healthWidth = 0;

  let ppWidth = pp/ppMax;
  if (ppWidth > 1) ppWidth = 1;
  if (ppWidth < 0) ppWidth = 0;

  healthWidth *= 200;
  ppWidth *= 200;

  return (
    <div >
      <div className={classes.playerName}>
        Player Name
      </div>
      <div className={classes.container}>
        <div className={classes.sectionContainer}>
          <div className={classes.barContainer}>
            <div className={classes.bar} style={{backgroundColor: '#F00', width: `${healthWidth}px`}}></div>
          </div>
          Health {health}/{healthMax} 
        </div>
        <div className={classes.sectionContainer}>
          <div className={classes.barContainer}>
            <div className={classes.bar} style={{backgroundColor: '#00F', width: `${ppWidth}px`}}></div>
          </div>
          PP {pp}/{ppMax} 
        </div>
      </div>
    </div>
  );
}