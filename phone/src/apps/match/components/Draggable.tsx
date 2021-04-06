import React, { useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core';

import { LikeorDislikeDraggableElement } from '../utils/drag';

const useStyles = makeStyles({
  root: {
    position: 'relative',
    height: '100%',
    width: '100%',
  },
  like: {
    position: 'absolute',
    zIndex: 20,
    padding: '5px 15px',
    top: 100,

    color: 'green',
    border: '4px solid green',
    right: 15,
  },
  nope: {
    position: 'absolute',
    zIndex: 20,
    padding: '5px 15px',
    top: 100,

    color: 'red',
    border: '4px solid red',
    left: 15,
  },
});

interface IProps {
  id: string;
  children: JSX.Element | JSX.Element[];
  onDrag: (deltaX: number) => void;
  onDrop: () => void;
}

const MAX_ROTATION_DEG = 15;

function Draggable({ id, children, onDrag, onDrop }: IProps) {
  const classes = useStyles();
  const elementRef = useRef(null);

  useEffect(() => {
    const drag = new LikeorDislikeDraggableElement(elementRef, MAX_ROTATION_DEG, onDrag, onDrop);
    return () => drag.cleanup();
  }, [elementRef]); // eslint-disable-line

  return (
    <>
      <div ref={elementRef} key={id} id={id} className={classes.root}>
        {children}
      </div>
    </>
  );
}

export default Draggable;
