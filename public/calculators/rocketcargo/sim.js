let simulationParent = document.getElementById('simulation-holder');
let canvas;

let exhaustVelocity;
let fuelMass;
let rocketMass;
let massLossRate;

let rocketImg;
let ignitedRocket;

let rocket;

let dt;
let lastTime;

let gameState = 0;
let startCountdown = 3;

function preload()
{
  rocketImg = loadImage("/astrocalc/images/rocket.svg");
  ignitedRocket = loadImage("/astrocalc/images/rocket_ignited.svg");
}


function setup() {
  canvas = createCanvas(simulationParent.offsetWidth, simulationParent.offsetHeight);
  canvas.parent(simulationParent);

  // Setup calculate callback to start sim
  document.querySelector("#calculate").addEventListener('click', onSimualtionStart);
}

function onSimualtionStart()
{
  updateProperties();
  rocket = new Rocket(rocketMass, fuelMass, exhaustVelocity, massLossRate, rocketImg, ignitedRocket)
  gameState = 1;
}

// Gets the properties specified by the user
function updateProperties()
{
  exhaustVelocity = document.querySelector("#velocity-escape").valueAsNumber;
  fuelMass = document.querySelector("#mass-fuel").valueAsNumber;
  rocketMass = document.querySelector("#mass-without-fuel").valueAsNumber;
  massLossRate = document.querySelector("#mass-loss-rate").valueAsNumber;
}

function windowResized()
{
  resizeCanvas(simulationParent.offsetWidth, simulationParent.offsetHeight);
}

function draw() {
  calculateDeltatime();
  background(220);
  console.log(gameState);
  switch (gameState)
  {
    case 0: // Waiting for user input
      whileSimulationIsWaiting();
      break;
    
    case 1: // Countdown (pre launch)
      whilePreLaunch();
      break;
    
    case 2: // Simulation is running
      whileSimulationIsRunning();
      break;
  }
}

function whilePreLaunch()
{
  drawObjects();

  textAlign(CENTER, CENTER);
  text("Engine start in: " + Number((startCountdown).toFixed(2)), width / 2, height / 2);
  startCountdown -= dt;
  
  if (startCountdown <= 0)
  {
    startCountdown = 3;
    gameState = 2;
    rocket.startEngines();
  }
}

function whileSimulationIsWaiting()
{
  textAlign(CENTER, CENTER);
  text("Tryk beregn for at køre simulation.", width/2, height/2);
}

// Gets called every frame the simulation is running
function whileSimulationIsRunning()
{
  // Game is running
  rocket.update(dt);

  drawObjects();

  /* UI DRAWING */
  
  // Display debug info
  textAlign(LEFT, TOP);
  text("dt: " + dt, 0, 0);
}

function drawObjects()
{
  /* OBJECT DRAWING */
  push();

  // Translate center of screen is at rockets position
  translate(0, rocket.Position * rocket.DrawMultiplier);
  
  // Draw rocket to screen
  rocket.draw();
  
  // Draw ground
  fill(75, 75, 75);
  rect(0, height-225, width, 225);
  
  pop();
}

function calculateDeltatime()
{
  let currentTime = millis();
  dt = (currentTime - lastTime) / 1000;

  lastTime = currentTime;
}