import Particle from './Particle.js';
import Vector from './vector.js';

export default class ParticleSystem {
  constructor(p, customAttrs){
    const defaultAttrs = {
      numParticles: 100,
      particleAttrs: {},
      origin: new Vector(p.width/2, p.height/2)
    };
    let attrs = Object.assign({}, defaultAttrs, customAttrs);
    this.particleAttrs = attrs.particleAttrs;
    this.particles = [];
    this.numParticles = attrs.numParticles;

    for (let i = 0; i < this.numParticles; i++){
      this.particleAttrs.velocity = new Vector(p.random(-1, 1), p.random(-1, 1));
      this.particles.push(new Particle(p, this.particleAttrs))
    }

    this.p = p;
  }

  addParticle(){
    this.particleAttrs.velocity = new Vector(this.p.random(-1, 1), this.p.random(-1, 1));
    this.particles.push(new Particle(this.p, this.particleAttrs))
  }

  run(){
    this.particles.forEach((particle, i) => {
      particle.update();
      particle.display();

      if(particle.isDead()){
        this.particles.splice(i, 1);
      }
    });
  }
}
