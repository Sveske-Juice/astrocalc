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

        this.timeBeforeFuelUsed = fuelMass / fuelMassLossRate;
        console.log("Time before fuel is burned: " + this.timeBeforeFuelUsed + "s");
        console.log("v: " + this.velocity);
    }

    // Getters/Setters
    get Position() {
        return this.position;
    }

    get DrawMultiplier() {
        return this.drawMultiplier;
    }


    startEngines()
    {
        this.rocketIgnited = true;
    }

    addForce(force)
    {
        this.velocity += force / (this.mass + this.fuelMassLeft);
        console.log("adding force: " + force + " velocity is now: " + this.velocity);
    }

    update(dt)
    {
        // Only update rocket when its actually engines are thrusting
        if (!this.rocketIgnited)
            return;
        
        // Update how much fuel is left. It is precise since fuelMassLossRate is constant
        this.fuelMassLeft -= this.fuelMassLossRate * dt;
        this.fuelMassLeft = Rocket.clamp(this.fuelMassLeft, 0, Infinity);
        console.log("fuel left: " + this.fuelMassLeft);
        
        let netForce = 0;

        if (this.fuelMassLeft > 0)
        {
            // Use Euler's method to calculate the force applied to the rocket this frame (in the timeperoid of last frame and this frame).
            let force = -this.fuelExhaustVelocity * -this.fuelMassLossRate * dt;
            netForce += force;
        }

        // Apply gravity
        netForce += this.gravity * (this.mass + this.fuelMassLeft) * dt;

        // Apply net force
        this.addForce(netForce);

        // Use Euler's method to calculate the position this frame.
        this.position += this.velocity * dt;

        console.log("Altitude: " + this.position);

        // Update so rocket is in center

    }

    draw()
    {
        imageMode(CORNER);
        if (this.rocketIgnited)
            image(this.ignitedRocket, width / 2 - this.rocketImg.width / 2, -this.position * this.drawMultiplier + this.rocketImg.height / 2);
        else
            image(this.rocketImg, width / 2 - this.rocketImg.width / 2, -this.position * this.drawMultiplier + this.rocketImg.height / 2);
    }

    // Utillity method for clamping values in range
    static clamp(number, min, max) {
        return Math.max(min, Math.min(number, max));
    }
}