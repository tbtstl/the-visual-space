import math from 'mathjs';
import Vector, { fromPolar } from './vector.js';
import {
  extractPos,
  extractVel,
  map,
  getNormalPoint
} from './utils.js';

// Returns a function that accepts an agent object
// Will return a force to apply to agent to reach target location
export const seek = (target) => (a) => {
  const tPos = extractPos(target);
  const tVel = extractVel(target);
  const tRadius = target.radius || 10;
  const maxSpeed = a.mover.maxSpeed;

  // Predict where they will be
  const predictedLoc = tPos.add(tVel);

  let desired = predictedLoc.subtract(a.mover.pos);
  const d = desired.magnitude();
  desired = desired.normalize();

  if (d < tRadius) {
    const m = map(d, 0, tRadius, 0, maxSpeed);
    desired = desired.setMag(m);
  } else {
    desired = desired.setMag(maxSpeed);
  }

  const steer = desired.subtract(a.mover.vel);

  return steer;
};

// Returns a function that returns a force away from a target
//  only if the agent is within the targets radius
//  otherwise the force is 0
export const flee = (targets) => (a) => {
  const tPos = extractPos(target);
  const tRadius = target.radius || false;
  const maxSpeed = a.mover.maxSpeed;

  let desired = tPos.subtract(a.mover.pos);
  const d = desired.magnitude();
  desired = desired.normalize();

  if (tRadius && d > tRadius) {
    return new Vector(0, 0);
  }

  desired.multiply(maxSpeed);
  const steer = desired.subtract(a.mover.vel);
  return steer.negative();
};

// Avoid the walls with a force
export const stayWithinWalls = (width, height, padding) => (a) => {
  const maxSpeed = a.maxSpeed;
  const location = a.location;
  const desired = a.velocity.clone();

  if (location.x < padding) {
    desired.x = maxSpeed;
  } else if (location.x > width - padding) {
    desired.x = -1 * maxSpeed;
  }

  if (location.y < padding) {
    desired.y = maxSpeed;
  } else if (location.y > height - padding) {
    desired.y = -1 * maxSpeed;
  }

  const steer = desired.subtract(a.velocity);
  return steer;
};

// Follow path (at least path.radius away)
export const followPath = (path) => (agent) => {
  const m = agent.mover;
  const predictedLoc = m.pos.add(m.vel);

  const a = path.start;
  const b = path.end;
  const normalPoint = getNormalPoint(predictedLoc, path.start, path.end);

  let dir = b.subtract(a);
  dir = dir.setMag(50); // Move a bit along path
  const target = normalPoint.add(dir);

  const distance = normalPoint.distance(predictedLoc);
  if (distance > path.radius) {
    return seek(target)(agent);
  }
  return new Vector();
};

// Wander with perlin noise
export const wander = (crazziness = 5) => (agent) => {
  const m = agent.mover;
  const predictedLoc = m.pos.add(m.vel.setMag(crazziness));

  const angle = math.random(2 * Math.PI);
  const target = predictedLoc.add(fromPolar(angle, 1));
  return seek(target)(agent);
};

// Follow path of flow field
export const followFlowField = (flowfield) => (agent) => {
  const m = agent.mover;
  const desired = flowfield.lookup(m.pos).setMag(m.maxSpeed);

  const steer = desired.subtract(m.vel);
  return steer;
};
