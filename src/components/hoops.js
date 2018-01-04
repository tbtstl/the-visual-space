import {Layer, Network, Neuron} from 'synaptic';
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
    this.description = 'Watch as the agent learns to shoot a ball in the net (Works best on desktop)';
  }

  sketch(p){

    // const logistic90 = (x, derivate) => Neuron.squash.LOGISTIC(x, derivate) * 90;
    const getNetwork = () => {
      const inputLayer = new Layer(5);
      const hiddenLayer = new Layer(3);
      const outputLayer = new Layer(2);

      inputLayer.project(hiddenLayer);
      hiddenLayer.project(outputLayer);

      hiddenLayer.set({squash: Neuron.squash.TANH});

      return new Network({
        input: inputLayer,
        hidden: [hiddenLayer],
        output: outputLayer
      });
    };


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
      bounce: {t: false, b: true, l: true, r: true},
      mass: 5
    };

    const netConfig = {
      location: new Vector(window.innerWidth*4/5, window.innerHeight/5),
      velocity: new Vector(0,0),
      acceleration: new Vector(0,0),
      width,
      height,
      color: colorMap.black,
      stroke: colorMap.lightRed,
      mass: 10
    };


    const learningRate = 0.01;
    const windowRatio = window.innerHeight/window.innerWidth;
    let xScale, yScale;
    if (windowRatio > 1){
      yScale = windowRatio*(window.innerWidth/25);
      xScale = 1/windowRatio * (window.innerHeight/40);
    } else {
      xScale = windowRatio*(window.innerWidth/35);
      yScale = 1/windowRatio * (window.innerHeight/40);
    }
    let network = getNetwork();
    let scored = false;
    let scoredCount = 0;
    let trainingSet = [];
    let epoch = 0;
    let delta;
    let prevMinDistance;
    let minDistance;
    let ball;
    let net;
    let output;
    let propTarget;
    let windFriction;

    const distanceH = (bLoc) => bLoc.distance(netConfig.location);
    const outputToVel = (o) => new Vector(o[0]*xScale, -o[1]*yScale);
    const getWindFriction = () => Math.random() * 0.1;
    const getPropagationTarget = () => {
      if(!trainingSet.length) return [-1,-1];
      trainingSet.sort((a, b) => {
        return a.minDistance < b.minDistance ? -1 : 1;
      });
      return trainingSet[0].output;
    };

    const reset = () => {
      prevMinDistance = minDistance;
      ball = new Mover(ballConfig, p);
      net = new Rectangle(netConfig, p);
      windFriction = getWindFriction();

      // Color the net green if the ball was scored in the last throw
      if (scored) {
        net.color = colorMap.lightGreen;
      }

      epoch++;
      scored = false;
      minDistance = Number.MAX_VALUE;
      // If we are training, also recreate the network
      if(epoch === 0 || (scoredCount === 0 && (delta > 0 && minDistance > 100))){
        network = getNetwork();
      } else {
        propTarget = getPropagationTarget();
        network.propagate(learningRate, propTarget);
      }
      output = network.activate([windFriction, ballConfig.location.x, ballConfig.location.y, netConfig.location.x, netConfig.location.y]);
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
      let stageForReset = false;

      const gravityForce = gravity()(ball);
      const airFrictionForce = friction(windFriction)(ball);

      // Reset if the ball is past the net
      if (ball.location.x > net.location.x){
        stageForReset = true;
      }

      // If we haven't scored, update the ball location
      if (!scored){
        ball.applyForce(gravityForce);
        ball.applyForce(airFrictionForce);
        ball.update();
      }

      minDistance = Math.min(minDistance, distanceH(ball.location));

      // If we score, set the scored count and flag
      if (minDistance < netConfig.mass*4){
        net.color = colorMap.lightGreen;
        net.display();
        scored = true;
        scoredCount++;
      }

      if (scored){
        stageForReset = true;
      }

      if(stageForReset){
        if(epoch === 1) prevMinDistance = minDistance;
        delta = minDistance - prevMinDistance;

        const trainingInstance = {output, minDistance};
        trainingSet.push(trainingInstance);
        reset();
      }

      ball.display();
      net.display();
      p.textSize(64);
      const accuracy = (scoredCount/epoch) * 100;
      p.text(`${accuracy.toFixed(2)}%`, window.innerWidth/2, window.innerHeight/2).fill(0,0,0);
    }
  }
}
