import containCanvas from 'p5-utils/containCanvas';
import P5Component from 'components/p5Component';
import colorMap from 'shared/colors';

import Vector from 'p5-utils/vector';
import Mover from 'p5-utils/Mover';
import Rectangle from 'p5-utils/Rectangle';
import {gravity, friction} from 'p5-utils/forces';

export default class Hoops extends P5Component {
  constructor(props){
    super(props);
    this.title = 'Hoops';
    this.description = 'Watch as the agent learns to shoot a ball in the net';
  }

  sketch(p){
    window.addEventListener('resize', function () {
      const width = window.innerWidth;
      const height = window.innerHeight;

      const canvas = p.createCanvas(width, height);
      containCanvas(canvas.elt);
    }, true);


    const frameRate = 60;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const ballConfig = {
      location: new Vector(30, window.innerHeight - 90),
      velocity: new Vector(0, 0),
      acceleration: new Vector(0, 0),
      width,
      height,
      color: colorMap.lightRed,
      stroke: colorMap.black,
      mass: 5
    };

    const netConfig = {
      location: new Vector(window.innerWidth - 60, window.innerHeight/3),
      velocity: new Vector(0,0),
      acceleration: new Vector(0,0),
      width,
      height,
      color: colorMap.white,
      stroke: colorMap.lightRed,
      mass: 10
    };

    const ball = new Mover(ballConfig, p);
    const net = new Rectangle(netConfig, p);


    p.setup = () => {
      const canvas = p.createCanvas(width, height);
      containCanvas(canvas.elt);
      p.frameRate(frameRate);
      p.smooth();

    };

    p.draw = () => {
      p.clear();

      const gravityForce = gravity()(ball);
      const airFrictionForce = friction(0.05)(ball);

      ball.applyForce(gravityForce);
      ball.applyForce(airFrictionForce);
      ball.update();
      ball.display();
      net.display();
    }
  }
}
