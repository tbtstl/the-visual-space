import React from 'react';
import styled from 'styled-components';

const P5CanvasContainer = (props) => {
  const D = styled('div')`
    position: absolute;
    top: 0;
    right: 0;
    width: 100vw;
    height: 90vh;
    z-index: -1;
  `;
  return (<D id="canvas-container"/>);
};

export default P5CanvasContainer;
