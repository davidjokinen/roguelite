import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';

function getActionText(entity) {
  let action = 'None';
  let subAction = '';
  if (entity.action) {
    action = entity.action.id;
    if (entity.action.subAction) {
      subAction = entity.action.subAction.id;
    }
  }
  return `${subAction} ${action}`;
}

export default function NpcView(props) {
  const { selectedEntity } = props;

  const [actionText, setActionText] = useState(getActionText(selectedEntity));

  useEffect(() => {
    const onEntityChange = () => {
      setActionText(getActionText(selectedEntity));
    };
    selectedEntity.addOnEntityUpdate(onEntityChange);
    return () => {
      selectedEntity.removeOnEntityUpdate(onEntityChange);
    }
  });
  
  return <div>
    <Typography variant="h5" component="h5">
      NPC Name
    </Typography>
    Action: {actionText}
  </div>
}
