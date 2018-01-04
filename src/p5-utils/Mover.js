import Vector from './vector.js';

export default class Mover {
  constructor(customAttrs, p){
    const defaultAttrs = {
      location: new Vector(0,0),
      velocity: new Vector(0, 0),
      acceleration: new Vector(0, 0),
      angle: 0,
      aVelocity: 0,
      aAcceleration: 0,
      mass: 1,
      width: 800,
      height: 800,
      color: 175,
      stroke: 0,
      bounce: {t: true, b: true, l: true, r: true},
      update: this.defaultUpdate,
      display: this.defaultDisplay
    };
    let attrs = Object.assign({}, defaultAttrs, customAttrs);
    this.location = attrs.location;
    this.velocity = attrs.velocity;
    this.acceleration = attrs.acceleration;
    this.angle = attrs.angle;
    this.aVelocity = attrs.aVelocity;
    this.aAcceleration = attrs.aAcceleration;
    this.mass = attrs.mass;
    this.canvasWidth = attrs.width;
    this.canvasHeight = attrs.height;
    this.color = attrs.color;
    this.stroke = attrs.stroke;
    this.bounce = attrs.bounce;
    this.p = p;
  }

  update() {
    this.velocity = this.velocity.add(this.acceleration);
    this.location = this.location.add(this.velocity);

    this.aVelocity += this.aAcceleration;
    this.aVelocity = this.p.constrain(this.aVelocity, -0.1, 0.1);
    this.angle += this.aVelocity;

    this.acceleration = this.acceleration.multiply(0);

    // Bounce off edges
    if(this.location.x > this.canvasWidth && this.bounce.r){
      this.location.x = this.canvasWidth;
      this.velocity.x = this.velocity.x * -1;
    } else if (this.location.x < 0 && this.bounce.l){
      this.location.x = 0;
      this.velocity.x = this.velocity.x * -1;
    }

    if(this.location.y > this.canvasHeight && this.bounce.b){
      this.location.y = this.canvasHeight;
      this.velocity.y = this.velocity.y * -1;
    } else if (this.location.y < 0 && this.bounce.t){
      this.location.y = 0;
      this.velocity.y = this.velocity.y * -1;
    }

  }

  display(){
    this.p.stroke(this.stroke);
    this.p.fill(this.color);
    this.p.ellipse(this.location.x, this.location.y, this.mass*10, this.mass*10);
  }

  applyForce(f){
    let force = f.divide(this.mass);
    this.acceleration = this.acceleration.add(force);
  }
}
