import Mover from './Mover.js';

export default class Rectangle extends Mover {
    defaultDisplay(){
      this.angle = Math.atan2(this.velocity.y, this.velocity.x);

      this.p.stroke(this.stroke);
      this.p.fill(this.color);
      this.p.rectMode(p.CENTER);
      this.p.pushMatrix();
      this.p.translate(this.location.x, this.location.y);
      this.p.rotate(this.angle);
      this.p.rect(0, 0, this.mass*16, this.mass*16);
      this.p.popMatrix();

    }
}
