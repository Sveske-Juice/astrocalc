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

let WAITING = 0;
let PAUSED = 10;
let COUNTDOWN = 15;
let RUNNING = 20;

let gameState = WAITING;
let startCountdown = 3;

function preload()
{
  rocketImg = loadImage("/astrocalc/images/rocket.svg");
  ignitedRocket = loadImage("/astrocalc/images/rocket_ignited.svg");
}


function setup() {
  canvas = createCanvas(simulationParent.offsetWidth, simulationParent.offsetHeight);
  canvas.parent(simulationParent);

  // Setup callbacks
  document.querySelector("#calculate").addEventListener('click', onSimualtionStart);
  document.querySelector("#toggle-pause").addEventListener('click', onTogglePausePressed);
  document.querySelector("#single-step").addEventListener('click', StepSimulation);

  // Start with default values for rocket:
  rocket = new Rocket(25000, 60000, 3500, 250, rocketImg, ignitedRocket)
}

function onSimualtionStart()
{
  updateProperties();
  rocket = new Rocket(rocketMass, fuelMass, exhaustVelocity, massLossRate, rocketImg, ignitedRocket)
  gameState = COUNTDOWN;
}

function onTogglePausePressed()
{
  if (gameState == PAUSED)
    gameState = RUNNING;
  else
    gameState = PAUSED;
}

function StepSimulation()
{
  if (gameState != PAUSED)
    return;

  whileSimulationIsRunning();
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

  drawObjects();

  switch (gameState)
  {
    case WAITING: // Waiting for user input
      whileSimulationIsWaiting();
      break;
    
    case PAUSED:
      // TODO show pause symbol
      whilePaused();
      break;

    case COUNTDOWN: // Countdown (pre launch)
      whilePreLaunch();
      break;
    
    case RUNNING: // Simulation is running
      whileSimulationIsRunning();
      break;
  }

  /* UI DRAWING */
  
  // Display debug info

  // Background
  let menuWidth = 250;
  let menuHeight = height / 5;
  let entryHeightStep = 25;
  fill(22, 26, 29, 95);
  rectMode(CORNER);
  rect(0, 0, menuWidth, menuHeight);

  fill(0);
  textAlign(LEFT, TOP);

  // Show frametime
  text("frametime, dt: " + dt, 5, 0);

  // Show gravity
  text("tyngdekraftacceleration: " + rocket.Gravity, 5, entryHeightStep);

  // Show altitude
  text("Højde: " + rocket.Position, 5, entryHeightStep * 2);

  // Show velocity
  text("Hastighed: " + rocket.Velocity, 5, entryHeightStep * 3);

  // Fuel left
  text("Brændstof tilbage: " + rocket.FuelLeft, 5, entryHeightStep * 4);

  // Show when fuel will be burned
  text("Brændstof opbrugt om: " + rocket.FuelBurnedIn + "s", 5, entryHeightStep * 5)

  // Mass of rocket and fuel
  text("Total masse af raket: " + rocket.TotalMass, 5, entryHeightStep * 6);
}

// when waiting
function whileSimulationIsWaiting()
{
  textAlign(CENTER, CENTER);
  text("Tryk beregn for at starte simulation.", width / 2, height / 10);
}

function whilePreLaunch()
{

  textAlign(CENTER, CENTER);
  text("Raketmotorer starter om: " + int(startCountdown) + "s", width / 2, height / 10);
  startCountdown -= dt;
  
  if (startCountdown <= 0)
  {
    startCountdown = 3;
    gameState = RUNNING;
    rocket.startEngines();
  }
}

// when paused
function whilePaused()
{
  textAlign(CENTER, CENTER);
  text("Spil er pauset. Du kan single step ved brug af knapperne.", width / 2, height / 10);
}

// Gets called every frame the simulation is running
function whileSimulationIsRunning()
{
  // Game is running
  rocket.update(dt);
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
  rect(0, height-150, width, 150);
  
  pop();
}

function calculateDeltatime()
{
  let currentTime = millis();
  dt = (currentTime - lastTime) / 1000;

  lastTime = currentTime;
}