import Vector from './vector.js';
import {colorAlpha} from './utils.js'

export default class Particle {
  constructor(p, customAttrs){
    let defaultAttrs = {
      location: new Vector(0,0),
      velocity: new Vector(p.random(-1, 1), p.random(-2, 0)),
      acceleration: new Vector(0, 0.05),
      lifespan: 255,
      stroke: 0,
      fill: 175,
    };
    let attrs = Object.assign({}, defaultAttrs, customAttrs);
    this.location = attrs.location;
    this.velocity = attrs.velocity;
    this.acceleration = attrs.acceleration;
    this.lifespan = attrs.lifespan;
    this.stroke = attrs.stroke;
    this.fill = attrs.fill;
    this.p = p;
  }

  isDead(){
    if(this.lifespan < 0.0) return true;
    return false;
  }

  update(){
    this.velocity = this.velocity.add(this.acceleration);
    this.location = this.location.add(this.velocity);
    this.lifespan -= 2;
  }

  display(){
    this.p.stroke(colorAlpha(this.p, this.stroke, (this.lifespan/255) + 0.001));
    this.p.fill(colorAlpha(this.p, this.fill, (this.lifespan/255) + 0.001));
    this.p.ellipse(this.location.x, this.location.y, 9, 9);
  }
}
