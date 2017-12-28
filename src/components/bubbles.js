import Mover from 'p5-utils/Mover';
import Vector from 'p5-utils/vector';
import Attractor from 'p5-utils/Attractor';
import containCanvas from 'p5-utils/containCanvas';
import P5Component from 'components/p5Component';

export default class Bubbles extends P5Component {
  constructor(props){
    super(props);
    this.title = 'Bubbles';
    this.description = 'Watch as the bubbles gravitate around the center of your screen. Click to move the center of gravity.'
  }

  sketch(p){
    const frameRate = 60;
    let width = window.innerWidth;
    let height = window.innerHeight - 10;
    let color = '#FFDFDF';
    let stroke = '#00449E';
    let location = new Vector(width / 2, height / 2);
    let velocity = new Vector(0, 0);
    let acceleration = new Vector(0, 0);

    window.addEventListener('resize', function () {
      width = window.innerWidth;
      height = window.innerHeight;

      const canvas = p.createCanvas(width, height);
      containCanvas(canvas.elt);
    }, true);

    let initialMover = {
      location: location,
      velocity: velocity,
      acceleration: acceleration,
      width: width,
      height: height,
      color: color,
      stroke: stroke
    };
    // make the attractor the same color as the background
    let attractorAttrs = {
      stroke: 'rgba(0,0,0,0)',
      color: 'rgba(0,0,0,0)',
      mass: 10
    };

    let movers = [];
    let numMovers = 100;

    let attractor;

    p.mousePressed = ()=> {
      if(attractor !== undefined){
        attractorAttrs.location = new Vector(p.mouseX, p.mouseY);
        attractor = new Attractor(p, attractorAttrs);
      }
    };

    p.setup = () => {
      const canvas = p.createCanvas(width, height);
      containCanvas(canvas.elt);
      p.frameRate(frameRate);
      p.smooth();
      for (let i = 0; i < numMovers; i++) {
        initialMover.mass = Math.floor((Math.random() * 5) + 1);
        let x = (Math.random() * (window.innerWidth)) + 1;
        let y = (Math.random() * (window.innerHeight)) + 1;
        initialMover.location = new Vector(x, y);
        movers.push(new Mover(initialMover, p));
      }

      attractor = new Attractor(p, attractorAttrs);

    };

    p.draw = ()=> {
      p.clear();

      movers.forEach((m) => {
        let attractionForce = attractor.attract(m);
        // console.log(attractionForce);
        m.applyForce(attractionForce);
        m.update();
        m.display();
      });

      if(attractor !== undefined){
        attractor.display();
      }
    }
  }
}
