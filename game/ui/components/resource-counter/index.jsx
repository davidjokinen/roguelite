import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';

const useStyles = makeStyles({
  root: {
    // height: 240,
    flexGrow: 1,
    maxWidth: 100,
  },
});

export default function ResourceCounter(props) {
  const classes = useStyles();

  return (
    <TreeView
      className={classes.root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      <TreeItem nodeId="2" label="Wood: 10" />
      <TreeItem nodeId="3" label="Stone: 10" />
      <TreeItem nodeId="5" label="Food">
        <TreeItem nodeId="10" label="Berries: 5" />
      </TreeItem>
    </TreeView>
  );
}