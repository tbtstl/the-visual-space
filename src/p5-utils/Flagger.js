import Vehicle from './Vehicle.js';
import Vector from './vector.js';

import {extractPos, extractVel} from './utils.js';

export default class Flagger extends Vehicle {
  constructor(p, customAttrs){
    super(p, customAttrs);
  }

  inSafeZone(teamNum){
    return teamNum === 1 ? this.location.x < this.p.width/2 : this.location.x > this.p.width/2;
  }

  applyBehaviours(teamNum, otherTeam, flagLoc){
    console.log(otherTeam);
    let wallForce = this.stayWithinWalls();
    console.log(wallForce);
    this.applyForce(wallForce);

    flagLoc = flagLoc || new Vector(this.p.width/2, this.p.height/2);
    let seekForce = this.seek(flagLoc);
    console.log(seekForce);
    this.applyForce(seekForce);

    if (!this.inSafeZone(teamNum)){
      let fleeForce = this.flee(otherTeam);
      this.applyForce(fleeForce);
    }
  }

  seek(target){
    const tLoc = extractPos(target);
    const tVel = extractVel(target);
    const tRadius = target.mass || 10;
    const maxSpeed = this.maxSpeed;

    // Predict where it will be
    const predictedLoc = tLoc.add(tVel);

    let desired = predictedLoc.subtract(this.location);
    const d = desired.magnitude();
    desired = desired.normalize();

    if(d < tRadius){
      const m = map(d, 0, tRadius, 0, maxSpeed);
      desired = desired.setMag(m);
    } else {
      desired = desired.setMag(maxSpeed);
    }
    const steer = desired.subtract(this.velocity);

    return steer;
  }

  flee(targets){
    // avoid enemies
    const desiredSeperation = this.size * 2;
    let sum = new Vector();
    let count = 0;

    targets.forEach((target)=>{
      let d = this.location.subtract(target.location);

      if(d > 0 && d < desiredSeperation){
        let diff = this.location.subtract(target.location);
        diff = diff.normalize();
        diff = diff.divide(d);
        sum = sum.add(diff);
        count ++;
      }
    });

    if (count > 0){
      sum = sum.divide(count);
      sum = sum.normalize();
      sum = sum.multiply(this.maxSpeed);
      sum = sum.subtract(this.velocity);
      sum = sum.limit(this.maxForce);
    }

    return sum;
  }

  stayWithinWalls(){
    let padding = 20;
    let desired = this.velocity.clone();

    if (this.location.x < padding){
      desired.x = this.maxSpeed;
      desired.x = -1 * this.maxSpeed;
    } else if (location.x > this.p.width - padding) {
      desired.x = -1 * this.maxSpeed;
    }

    if (this.location.y < padding){
      desired.y = this.maxSpeed;
    } else if (this.location.y > this.p.height - padding) {
      desired.y = -1 * this.maxSpeed;
    }

    const steer = desired.subtract(this.velocity);
    return steer;
  }
}
