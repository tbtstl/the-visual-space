import {Layer, Network} from 'synaptic';
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
    const inputLayer = new Layer(4);
    const hiddenLayer = new Layer(3);
    const outputLayer = new Layer(2);

    inputLayer.project(hiddenLayer);
    hiddenLayer.project(outputLayer);

    // const logistic90 = (x, derivate) => Neuron.squash.LOGISTIC(x, derivate) * 90;

    const network = new Network({
      input: inputLayer,
      hidden: [hiddenLayer],
      output: outputLayer
    });

    // const learningRate = 0.1;

    window.addEventListener('resize', function () {
      const width = window.innerWidth;
      const height = window.innerHeight;

      const canvas = p.createCanvas(width, height);
      containCanvas(canvas.elt);
    }, true);

    const frameRate = 30;
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

    const distanceH = (bLoc) => bLoc.distance(netConfig.location);
    const outputToVel = (o) => new Vector(o[0]*50, o[1]*-50);
    let scored = false;
    let minDistance = Number.MAX_VALUE;

    let ball;
    let net;
    let output;

    const reset = () => {
      ball = new Mover(ballConfig, p);
      net = new Rectangle(netConfig, p);
      output = network.activate([ballConfig.location.x, ballConfig.location.y, netConfig.location.x, netConfig.location.y]);
      ball.velocity = outputToVel(output);
    };

    p.setup = () => {
      const canvas = p.createCanvas(width, height);
      containCanvas(canvas.elt);
      p.frameRate(frameRate);
      p.smooth();
      reset();
    };

    p.draw = () => {
      p.clear();

      const gravityForce = gravity()(ball);
      const airFrictionForce = friction(0.05)(ball);

      if (ball.location.x > net.location.x){
        reset();
      }

      if (!scored){
        ball.applyForce(gravityForce);
        ball.applyForce(airFrictionForce);
        ball.update();
      }

      minDistance = Math.min(minDistance, distanceH(ball.location));

      if (minDistance < netConfig.mass*2){
        scored = true;
        net.color = colorMap.lightGreen;
      }

      // network.propagate(learningRate, [0]);
      ball.display();
      net.display();
    }
  }
}
