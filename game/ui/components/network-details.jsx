import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

export default function NetworkDetails(props) {
  const { children, value, index } = props;
  const { components } = props;

  const socket = components['socket'];
  const [playerCount, updatePlayerCount] = React.useState(socket.players.length || 0);
  const handlePlayerCountChange = (players) => {
    updatePlayerCount(socket.players.length);
  };

  React.useEffect(() => {
    socket.addOnPlayerChange(handlePlayerCountChange);
    return () => {
      socket.removeOnPlayerChange(handlePlayerCountChange);
    };
  }, [playerCount]);
  
  return (
    <div>
      Player Count: {playerCount}
    </div>
  );
}

// TabPanel.propTypes = {
//   children: PropTypes.node,
//   index: PropTypes.any.isRequired,
//   value: PropTypes.any.isRequired,
// };