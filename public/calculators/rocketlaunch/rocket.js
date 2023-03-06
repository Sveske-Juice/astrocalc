class Rocket {
    constructor(mass, fuelMass, fuelExhaustVelocity, fuelMassLossRate, rocketImg, ignitedRocket)
    {
        // Set class members
        this.mass = mass;
        this.fuelMass = fuelMass;
        this.fuelExhaustVelocity = fuelExhaustVelocity;
        this.fuelMassLossRate = fuelMassLossRate;
        
        this.fuelMassLeft = fuelMass;
        this.velocity = 0;
        this.previousVelocity = 0;
        this.position = 0;
        this.gravity = -9.82;
        this.impulseDelta = 0;
        this.G = 6.674e-11;
        this.earthMass = 5.9722e24;
        this.earthRadius = 6.3781e6;
        this.impulseDeltas = [0];

        this.rocketImg = rocketImg;
        this.ignitedRocket = ignitedRocket;
        
        this.rocketIgnited = false;
        this.drawMultiplier = 35; // How many pixels one position unit corresponds to. 
        this.drawHeightOffset = 0;
    }

    // Getters/Setters
    get Position() {
        return this.position;
    }

    get DrawMultiplier() {
        return this.drawMultiplier;
    }

    get Gravity() {
        return this.gravity;
    }

    get Velocity() {
        return this.velocity;
    }

    get FuelLeft() {
        return this.fuelMassLeft;
    }

    get TotalMass() {
        return (this.mass + this.fuelMassLeft);
    }

    get FuelBurnedIn() {
        return this.fuelMassLeft / this.fuelMassLossRate;
    }

    // Change in velocity since last frame
    get VelocityDelta() {
        return this.velocity - this.previousVelocity;
    }

    get MassFlowRate() {
        return this.fuelMassLossRate;
    }

    get FuelExhaustVelocity() {
        return this.fuelExhaustVelocity;
    }

    get AvgImpulseDelta() {
        return averageOfArray(this.impulseDeltas);
    }


    startEngines()
    {
        this.rocketIgnited = true;
    }

    addForce(force)
    {
        this.velocity += force / this.TotalMass;
    }

    update(dt)
    {
        // Only update rocket when its actually engines are thrusting
        if (!this.rocketIgnited)
            return;
        
        // Update how much fuel is left. It is precise since fuelMassLossRate is constant
        this.fuelMassLeft -= this.fuelMassLossRate * dt;
        this.fuelMassLeft = Rocket.clamp(this.fuelMassLeft, 0, Infinity);
        
        let netForce = 0;
        this.updateGravity();

        if (this.fuelMassLeft > 0)
        {
            // Calculate the force applied to the rocket this frame.
            let rocketForce = -this.fuelExhaustVelocity * -this.fuelMassLossRate * dt;
            netForce += rocketForce;
        }

        // Apply gravity using Euler's method for numerical intergration
        let gravity = this.gravity * this.TotalMass * dt;
        netForce += gravity;

        // Apply net force
        this.addForce(netForce);

        this.handleNegativeVelocity(dt);
        
        this.handleAllFuelBurned();
        
        if (this.fuelMassLeft > 0) // While rocket is accelerating
            // Calculate change in impulse where external forces like gravity and and air resitance is ignored. Used to see the overall precision of the simulation.
            this.impulseDelta = this.TotalMass * this.VelocityDelta - this.fuelMassLossRate * dt * this.fuelExhaustVelocity - gravity;
        else // Once fuel tanks is empty there are out of system
            this.impulseDelta = 0;
        
        this.updateAvgMomentumChange();
        
        // Use Euler's method to calculate the position this frame.
        this.position += this.velocity * dt;

        this.previousVelocity = this.velocity;
    }

    draw()
    {
        imageMode(CORNER);
        if (this.rocketIgnited && this.fuelMassLeft > 0)
            image(this.ignitedRocket, width / 2 - this.rocketImg.width / 2, -this.position * this.drawMultiplier + this.rocketImg.height / 2);
        else
            image(this.rocketImg, width / 2 - this.rocketImg.width / 2, -this.position * this.drawMultiplier + this.rocketImg.height / 2);
    }

    handleNegativeVelocity(dt)
    {
        if (this.velocity > 0)
            return;
        
        if (this.position > 0)
            return;
            
        fill(255,0,0);
        textAlign(CENTER, CENTER);
        text("RAKETMOTORER KAN IKKE LØFTE RAKET! F_raket ~= " + parseInt(this.TotalMass * (this.velocity/dt), 10), width / 2, height / 9);
            
        // If its at the launchpad don't let it go through it
        this.velocity = Rocket.clamp(this.velocity, 0, Infinity);
        this.position = 0;
    }

    handleAllFuelBurned()
    {
        if (this.fuelMassLeft > 0)
            return;

        fill(255,0,0);
        textAlign(CENTER, CENTER);
        text("IKKE MERE BRÆNDSTOF TILBAGE!", width / 2, height / 10);
    }

    // Updates gravitational acceleration value based on distance from surface
    updateGravity()
    {
        let gravitationalForce = -this.G * (rocket.TotalMass * this.earthMass)/(Math.pow((this.earthRadius + rocket.Position), 2));
        this.gravity = gravitationalForce/rocket.TotalMass;
    }

    updateAvgMomentumChange()
    {
        this.impulseDeltas.push(this.impulseDelta);
        if (this.impulseDeltas >= 120)
        {
          this.impulseDeltas.shift();
        }
    }

    
    // Utillity method for clamping values in range
    static clamp(number, min, max) {
        return Math.max(min, Math.min(number, max));
    }
}