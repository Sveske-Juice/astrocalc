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
        this.position = 0;
        this.gravity = -9.82;

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

        if (this.fuelMassLeft > 0)
        {
            // Use Euler's method to calculate the force applied to the rocket this frame (in the timeperoid of last frame and this frame).
            let force = -this.fuelExhaustVelocity * -this.fuelMassLossRate * dt;
            netForce += force;
        }

        // Apply gravity
        netForce += this.gravity * this.TotalMass * dt;

        // Apply net force
        this.addForce(netForce);

        this.handleNegativeVelocity(dt);

        this.handleAllFuelBurned();

        // Use Euler's method to calculate the position this frame.
        this.position += this.velocity * dt;
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
        text("RAKETMOTORER KAN IKKE LØFTE RAKET! F_raket ~= " + int(this.TotalMass * (this.velocity/dt)), width / 2, height / 10);
            
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
    
    // Utillity method for clamping values in range
    static clamp(number, min, max) {
        return Math.max(min, Math.min(number, max));
    }
}