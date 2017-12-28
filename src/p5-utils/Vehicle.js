import Vector from './vector.js';
import Mover from './Mover.js';
import {seek, stayWithinWalls, flee} from './behaviors.js';

export default class Vehicle extends Mover {
  constructor(p, customAttrs){
    super(p, customAttrs);
    const defaultAttrs = {
      location: new Vector(p.width/2, p.height/2),
      velocity: new Vector(0, 0),
      acceleration: new Vector(0, 0),
      maxSpeed: 5,
      maxForce: 0.1,
      size: 10,
      fill: 175,
      stroke: 0,
      behaviours: [stayWithinWalls(p.width, p.height, 5), seek()]
    };

    let attrs = Object.assign({}, defaultAttrs, customAttrs);
    Object.assign(this, attrs);
    this.p = p;

    this.display = this.display.bind(this);
  }

  applyBehaviours(){
    this.behaviours.forEach((b) => {
      const isObj = typeof b === 'object';
      const weight = isObj ? b.weight : 1;
      const force = isObj ? b.fn(this) : b(this);
      this.applyForce(force.multiply(force.multiply(weight)));
    });
  }

  update(){
    super.update();
  }

  display() {
    this.p.fill(this.fill);
    this.p.stroke(this.stroke);
    this.p.push();
    this.p.translate(this.location.x, this.location.y);
    this.p.ellipse(0, 0, this.size, this.size);
    this.p.pop();
  }

}
