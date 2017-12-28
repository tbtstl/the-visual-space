import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import styled from 'styled-components';
import {
  Provider,
  Heading,
  Absolute,
  Flex,
  Box
} from 'rebass';
import colorMap from 'shared/colors';
import Home from 'components/home';
import RouterLink from 'components/routerLink';
import Bubbles from 'components/bubbles';
import Follower from 'components/follower';
import Hoops from 'components/hoops';

class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      backgroundColor: 'white',
      color: 'black',
      colors: []
    }
  }

  render() {
    document.body.style.backgroundColor = colorMap.nearWhite;

    const colorCycles = [
      colorMap.nearWhite,
      colorMap.darkRed,
      colorMap.lightRed,
      colorMap.purple,
      colorMap.lightPurple,
      colorMap.darkPink,
      colorMap.lightPink,
      colorMap.darkGreen,
      colorMap.lightGreen,
      colorMap.darkBlue,
      colorMap.lightBlue
    ];

    const ColorCycle = styled(Heading)`
      animation: colorchange 40s infinite;
      -webkit-animation: colorchange 40s infinite;
      @keyframes colorchange
      {
        0%   {color: ${colorCycles[0]};}
        10%   {color: ${colorCycles[1]};}
        20%   {color: ${colorCycles[2]};}
        30%   {color: ${colorCycles[3]};}
        40%   {color: ${colorCycles[4]};}
        50%   {color: ${colorCycles[5]};}
        60%   {color: ${colorCycles[6]};}
        70%   {color: ${colorCycles[7]};}
        80%   {color: ${colorCycles[8]};}
        90%   {color: ${colorCycles[9]};}
        100%   {color: ${colorCycles[0]};}
      }
  
      @-webkit-keyframes colorchange /* Safari and Chrome - necessary duplicate */
      {
        0%   {color: ${colorCycles[0]};}
        10%   {color: ${colorCycles[1]};}
        20%   {color: ${colorCycles[2]};}
        30%   {color: ${colorCycles[3]};}
        40%   {color: ${colorCycles[4]};}
        50%   {color: ${colorCycles[5]};}
        60%   {color: ${colorCycles[6]};}
        70%   {color: ${colorCycles[7]};}
        80%   {color: ${colorCycles[8]};}
        90%   {color: ${colorCycles[9]};}
        100%   {color: ${colorCycles[0]};}
      }
    `;

    return (
      <Router>
        <Provider>
          <Absolute bottom left>
            <Heading is="h1" f={[4,5,7,9]}>The Visual </Heading>
          </Absolute>
          <Absolute bottom right>
            <ColorCycle is="h1" f={[4,5,7,9]}>.Space</ColorCycle>
          </Absolute>
        <Flex wrap m={2}>
          <Box width={1} mx={3}>
            <RouterLink exact to="/">Home</RouterLink>
            <RouterLink to="/follower">Follower</RouterLink>
            <RouterLink to="/bubbles">Bubbles</RouterLink>
            <RouterLink to="/hoops">Hoops</RouterLink>
          </Box>
          <Box width={1} mx={3}>
            <Route exact path="/" component={Home}/>
            <Route path="/bubbles" component={Bubbles}/>
            <Route path="/follower" component={Follower}/>
            <Route path="/hoops" component={Hoops}/>
          </Box>
        </Flex>
        </Provider>
      </Router>
    );
  }
}

export default App;
