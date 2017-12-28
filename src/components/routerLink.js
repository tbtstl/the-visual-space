import React from 'react';
import styled from 'styled-components';
import {NavLink as Link} from 'react-router-dom';
import {NavLink} from 'rebass';

export default class RouterLink extends React.PureComponent {
  render(){
    const Component = styled(NavLink)`
      &.active {
        text-decoration: wavy underline;      
      }
    `;
    return (
      <Component  {...this.props} is={Link}/>
    )
  }
}

