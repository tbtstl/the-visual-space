import Vector from './vector.js';

export default class Attractor {
  constructor(p, customAttrs){
    const defaultAttrs = {
      location: new Vector(p.width/2, p.height/2),
      mass: 5,
      cG: -1,
      dragOffset: new Vector(p.width/2, p.height/2),
      stroke: "#fff",
      color: '#000'
    };
    let attrs = Object.assign({}, defaultAttrs, customAttrs);
    this.p = p;
    this.location = attrs.location;
    this.mass = attrs.mass;
    this.cG = attrs.cG;
    this.dragOffset = attrs.dragOffset;
    this.stroke = attrs.stroke;
    this.color = attrs.color;
  }

  attract(mover){
    // Direction of force
    let force = new Vector(mover.location.x - this.location.x, mover.location.y - this.location.y);
    let distance = force.magnitude();
    distance = this.p.constrain(distance, 5, 25);
    force = force.normalize();

    // Magnitude of force
    let strength = (this.cG * this.mass * mover.mass) / (distance*distance);

    // Put Magnitude and direction  together
    force = force.multiply(strength);

    return force;
  }

  display(){
    this.p.stroke(this.stroke);
    this.p.fill(this.color);
    this.p.ellipse(this.location.x, this.location.y, this.mass*10, this.mass*10);
  }

}
