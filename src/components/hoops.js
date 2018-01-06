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
      const inputLayer = new Layer(4);
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

    const duration = frameRate;
    const targetXVel = (netConfig.location.x - ballConfig.location.x)/duration;
    const targetYVal = (netConfig.location.y - ballConfig.location.y)*9.8*duration/(duration * duration * ballConfig.location.y);

    const learningRate = 0.1;
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

    const scaleDown = (input=[]) => {
      const max = Math.max(...input);
      const min = Math.min(...input);
      return input.map((a) => (a-min)/(max-min));
    };
    const scaleUp = (output) => {
      const height = window.innerHeight;
      const width = window.innerWidth;
      const x = netConfig.location.x;
      const y = netConfig.location.y;
      const xScale = (20*x)/(height);
      const yScale = (20*y)/width;//Math.pow(y, 50);
      // console.log('xScale', xScale);
      // console.log('yScale', yScale);
      return [output[0]*xScale, output[1]*yScale];
    };
    const distanceH = (bLoc) => bLoc.distance(netConfig.location);
    const outputToVel = (o) => new Vector(o[0], -o[1]);
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

      // Color the net green if the ball was scored in the last throw
      if (scored) {
        net.color = colorMap.lightGreen;
      }

      epoch++;
      scored = false;
      minDistance = Number.MAX_VALUE;
      // If we are training, also recreate the network
      if(epoch === 0 || (epoch % 5 && scoredCount === 0)){
        network = getNetwork();
      } else {
        propTarget = getPropagationTarget();
        network.propagate(learningRate, propTarget);
      }
      const rawInput = [ballConfig.location.x, ballConfig.location.y, netConfig.location.x, netConfig.location.y];
      const scaledInput = scaleDown(rawInput);
      // console.log('in: ', scaledInput);
      output = network.activate(scaledInput);
      const scaledOutput = scaleUp(output);
      // console.log('out: ', output);
      // console.log('scaled out: ', scaledOutput);
      // ball.velocity = outputToVel(scaledOutput);
      console.log('xVel', targetXVel);
      console.log('yVel', targetYVal);
      ball.velocity = new Vector(targetXVel, targetYVal);
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
      const airFrictionForce = friction(0.02)(ball);

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
      const textSize = 64;
      p.textSize(textSize);
      const accuracy = (scoredCount/epoch) * 100;
      p.text(`${accuracy.toFixed(2)}%`, window.innerWidth/2-textSize, window.innerHeight/2).fill(0,0,0);
    }
  }
}
