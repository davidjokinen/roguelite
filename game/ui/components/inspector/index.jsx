import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: 'auto',
    maxWidth: 500,
    height: 100,
  },
}));

export default function Inspector(props) {
  const classes = useStyles();
  const { components, } = props;
  const entitySelector = components['entity-selector'];
  // TODO clean up (selectedEntity isn't really needed)
  const [selectedEntity, setSelectedEntity] = useState(entitySelector.selectedEntity.entity);

  function handleStatusChange(entity) {
    setSelectedEntity(entity);
  }

  useEffect(() => {
    const onEntityChange = entity => {
      handleStatusChange(entity);
    };
    entitySelector.addOnSelectedEntity(onEntityChange);
    return () => {
      entitySelector.removeOnSelectedEntity(onEntityChange);
    }
  });

  if (!selectedEntity) return (<></>);
  return (<Paper className={classes.paper}>
      Entity: {selectedEntity.id}
    </Paper>)
}