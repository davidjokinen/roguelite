import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';

function getName(obj, presentTense) {
  if (obj.actionName) {
    if (presentTense) 
      return obj.actionName.presentTense || obj.actionName.default || '';
    return obj.actionName.default || '';
  }
  return obj.name || obj.id || '';
}

function capitalizeFirstLetter(string) {
  const newString = string.trim();
  return newString.charAt(0).toUpperCase() + newString.slice(1);
}

function getActionText(entity) {
  let action = 'None';
  let subAction = '';
  let actionTarget = '';
  if (entity.action) {
    action = getName(entity.action, !entity.action.subAction);
    if (entity.action.subAction) {
      subAction = getName(entity.action.subAction, true) + ' to';
    }
    if (entity.action.target) {
      actionTarget = getName(entity.action.target.data).toLowerCase();;
    }
  }
  return capitalizeFirstLetter(`${subAction} ${action} ${actionTarget}`);
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
    {actionText}
  </div>
}
