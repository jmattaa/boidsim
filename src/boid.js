import { getRandRgb } from "./utils/utils.js";
import { Vector2 } from "./utils/vector2.js";

export class Boid {

    #separateForce = 1.5;
    #alignForce = 1.1;
    #cohesionForce = 1;

    constructor(
        x = Math.random() * window.canvas.width,
        y = Math.random() * window.canvas.height
    ) {
        this.position = new Vector2(x, y);
        this.velocity = new Vector2(
            (Math.random() * 2) - 1,
            (Math.random() * 2) - 1
        );
        this.velocity.setMag((Math.random() * 4) + 2);
        this.acceleration = new Vector2();

        this.color = getRandRgb();
        this.size = 3.0;

        this.maxSpeed = 4.0;
        this.maxSteerForce = 2 * 0.07; // the name's bond, james bond
        this.perceptionR = 30;
        //this.perceptionA = Math.PI / 2
    }

    update(boids) {
        let separateForce = this.separate(boids).mult(this.#separateForce);
        let alignForce = this.align(boids).mult(this.#alignForce);
        let cohesionForce = this.cohesion(boids).mult(this.#cohesionForce);

        this.acceleration.add(separateForce);
        this.acceleration.add(alignForce);
        this.acceleration.add(cohesionForce);

        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);

        this.wrap();
        this.acceleration.mult(0);
    }

    draw(ctx) {
        // idk why but we gotta add 90 degrees to dis
        let theta = this.velocity.heading() + Math.PI / 2;

        ctx.save();

        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(theta);

        ctx.fillStyle = this.color;
        ctx.strokeStyle = "#ddd";

        ctx.beginPath();
        ctx.moveTo(0, -this.size * 2);
        ctx.lineTo(-this.size, this.size * 2);
        ctx.lineTo(this.size, this.size * 2);
        ctx.closePath();

        ctx.fill();
        ctx.stroke();

        // cuz sometimes me wanna see
        //ctx.fillStyle = "rgba(1, 1, 1, .3)"
        //ctx.arc(0, 0, this.perceptionR, 0, Math.PI * 2);
        //ctx.fill()

        ctx.restore();
    }

    wrap() {
        if (this.position.x < -this.size) {
            this.position.x = window.canvas.width + this.size;
        }

        if (this.position.y < -this.size) {
            this.position.y = window.canvas.height + this.size;
        }

        if (this.position.x > window.canvas.width + this.size) {
            this.position.x = -this.size;
        }

        if (this.position.y > window.canvas.height + this.size) {
            this.position.y = -this.size;
        }
    }

    isInPerception(other) {
        return Vector2.dist(this.position, other.position) <= this.perceptionR;
    }

    separate(boids) {
        let boidCount = 0;
        let sum = new Vector2();

        const dist = this.size * 4;

        boids.forEach(other => {
            if (other === this || !this.isInPerception(other)) return;

            let d = Vector2.dist(this.position, other.position);
            let diff = new Vector2(this.position.x, this.position.y);
            diff.sub(other.position);
            diff.setMag(1 / d); // if d is small mag shall be big
            diff.mult(dist);

            sum.add(diff);
            boidCount++;
        });

        if (boidCount == 0) return sum;

        sum.div(boidCount);
        sum.limit(this.maxSteerForce);

        return sum;
    }

    align(boids) {
        let boidCount = 0;
        let avgVelocity = new Vector2();

        boids.forEach(other => {
            if (other === this || !this.isInPerception(other)) return;

            avgVelocity.add(other.velocity);
            boidCount++;
        });

        if (boidCount == 0) return avgVelocity;

        avgVelocity.div(boidCount);
        avgVelocity.sub(this.velocity); // dis idk why think bout it!
        avgVelocity.limit(this.maxSteerForce);

        return avgVelocity;
    }

    cohesion(boids) {
        let boidCount = 0;
        let avgPosition = new Vector2();

        boids.forEach(other => {
            if (other === this || !this.isInPerception(other)) return;

            avgPosition.add(other.position);
            boidCount++;
        });

        if (boidCount == 0) return avgPosition;

        avgPosition.div(boidCount);

        let steering =
            new Vector2(avgPosition.x, avgPosition.y).sub(this.position);
        steering.setMag(this.maxSpeed);
        steering.sub(this.velocity);
        steering.limit(this.maxSteerForce);

        return steering;
    }
}
