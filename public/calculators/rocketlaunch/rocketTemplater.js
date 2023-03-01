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
    let res = await fetch("https://casdnas.duckdns.org/astrocalc/calculators/rocketlaunch/enginedata.json")
    if (res.ok)
    {
        engineData = await res.json();
    }

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
    engineOrigin.innerText = engine.origin;
    engineContainer.appendChild(engineOrigin);

    // I_sp
    let engineIsp = document.createElement("p");
    engineIsp.innerText = "Isp: " + engine.isp + "s";
    engineContainer.appendChild(engineIsp);

    // Thrust
    let engineThrust = document.createElement("p");
    engineThrust.innerText = "jetkraft: " + engine.thrust + "N";
    engineContainer.appendChild(engineThrust);

}

function onEngineTemplateClicked(engine)
{
    console.log(engine.name + " was clicked");

    // Convert values
    let exhaustVelocity = Isp2ExhaustVel(engine.isp);
    let massFlowRate = thrust2MassFlowRate(engine.thrust, exhaustVelocity);

    // Set values
    exhaustVelocityElement.valueAsNumber = exhaustVelocity;
    massLossRateElement.valueAsNumber = massFlowRate;
}

init();