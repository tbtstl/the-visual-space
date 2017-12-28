import React from 'react';
import p5 from 'p5';
import Canvas from 'components/canvas';

export default class P5Component extends React.Component {
  componentDidMount(){
    new p5(this.sketch);
  }

  sketch(p){

  }

  componentWillUnmount(){
    const canvas = document.getElementsByTagName('canvas')[0];
    document.getElementById('canvas-container').removeChild(canvas);
  }

  render(){
    return (<Canvas/>)
  }
}
