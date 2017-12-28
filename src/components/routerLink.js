import React from 'react';
import {NavLink as Link} from 'react-router-dom';
import {NavLink} from 'rebass';

export default class RouterLink extends React.PureComponent {
  render(){
    return (
      <NavLink  {...this.props} is={Link}/>
    )
  }
}

