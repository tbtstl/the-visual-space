import React from 'react';
import p5 from 'p5';
import {Flex, Box, PanelHeader, Text} from 'rebass';
import FloatingPanel from 'components/floatingPanel';
import Canvas from 'components/canvas';

export default class P5Component extends React.Component {
  constructor(props){
    super(props);
    this.title = 'p5';
    this.description = '';
  }

  componentDidMount(){
    new p5(this.sketch);
  }

  static description = () => (
    ''
  );

  sketch(p){

  }

  componentWillUnmount(){
    const canvas = document.getElementsByTagName('canvas')[0];

    if (canvas){
      canvas.parentElement.removeChild(canvas);
    }
  }

  render(){
    return (
      <Flex align="center">
        <Box width={[1, 1/3, 1/5]} mt={5}>
          <FloatingPanel p={2} bg="white">
            <PanelHeader f={3} mb={3}>{this.title}</PanelHeader>
            <Text>{this.description}</Text>
          </FloatingPanel>
        </Box>
        <Canvas/>
      </Flex>
    )
  }
}
