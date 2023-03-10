let G0 = 9.82;
let engineData;

let engineTemplateParent = document.querySelector(".engine-templates");

let exhaustVelocityElement = document.querySelector("#velocity-escape");
let fuelMassElement = document.querySelector("#mass-fuel");
let rocketMassElement = document.querySelector("#mass-without-fuel");
let massLossRateElement = document.querySelector("#mass-loss-rate");

// See: https://en.wikipedia.org/wiki/Specific_impulse#Specific_impulse_as_effective_exhaust_velocity
function Isp2ExhaustVel(isp)
{
    return isp * G0;
}

function thrust2MassFlowRate(thrust, exhaustVelocity)
{
    return thrust / exhaustVelocity;
}

async function init()
{
    // Get engine data
    engineData = enginedata;

    generateEngineTemplates();
}

function generateEngineTemplates()
{
    let engines = engineData.length;
    for (let i = 0; i < engines; i++)
    {
        buildEngineTemplate(engineData[i]);
    }
}

function buildEngineTemplate(engine)
{
    engine.exhaustVelocity = Isp2ExhaustVel(engine.isp);
    engine.massFlowRate = thrust2MassFlowRate(engine.thrust, engine.exhaustVelocity);

    // Container
    let engineContainer = document.createElement("button");
    engineContainer.className = "engine-container";
    engineContainer.addEventListener('click', () => onEngineTemplateClicked(engine));
    engineTemplateParent.appendChild(engineContainer);

    // Name
    let engineName = document.createElement("p");
    engineName.innerText = engine.name;
    engineContainer.appendChild(engineName);
    
    // Origin
    let engineOrigin = document.createElement("p");
    engineOrigin.innerText = "Oprindelse: " + engine.origin;
    engineContainer.appendChild(engineOrigin);

    // I_sp
    let engineIsp = document.createElement("p");
    engineIsp.innerText = "Udstødningshastighed (u): " + parseInt(engine.exhaustVelocity, 10) + "m/s" + " (Isp: " + engine.isp + "s)";
    engineContainer.appendChild(engineIsp);

    // Thrust
    let engineThrust = document.createElement("p");
    engineThrust.innerText = "Massetilvækst pr. tid: " + parseInt(engine.massFlowRate, 10) + "kg/s (jetkraft: " + engine.thrust + "N)";
    engineContainer.appendChild(engineThrust);

}

function onEngineTemplateClicked(engine)
{
    console.log(engine.name + " was clicked");

    // Set values
    exhaustVelocityElement.valueAsNumber = engine.exhaustVelocity;
    massLossRateElement.valueAsNumber = engine.massFlowRate;
}

init();