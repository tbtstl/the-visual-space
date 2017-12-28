import React from 'react';
import P5Component from 'components/p5Component';

export default class Home extends P5Component {
  constructor(props){
    super(props);
    this.title = 'Welcome';
    this.description = (<div>Here you will find a collection of web experiments by <a href="https://tysonbattistella.com" target="_blank">Tyson Battistella</a>. These mini projects pay no attention to performance, and may cause rendering issues in your browser. </div>)
  }
}
