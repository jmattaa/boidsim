import { getRandRgb } from "./utils/utils.js";
import { Vector2 } from "./utils/vector2.js";

export class Boid {
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
        this.maxSteerForce = 10 * 0.07; // the name's bond, james bond
        this.perceptionR = 30;
        // this.perceptionA = Math.PI / 2 
    }

    update(boids) {
        this.separate(boids);
        this.align(boids);
        this.cohesion(boids);

        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);

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

    separate(boids) {
        let boidCount = 0;
        let sum = new Vector2();

        const dist = 3;

        boids.forEach(other => {
            let d = Vector2.dist(this.position, other.position);
            if (other === this ||
                d > this.perceptionR)
                return;

            let diff = new Vector2(this.position.x, this.position.y);
            diff.sub(other.position);
            diff.setMag(1 / d); // if d is small mag shall be big
            diff.mult(dist);

            sum.add(diff);
            boidCount++;
        });

        if (boidCount == 0) return;

        sum.div(boidCount);
        sum.limit(this.maxSteerForce);

        this.acceleration.add(sum);
    }

    align(boids) {
        let boidCount = 0;
        let avgVelocity = new Vector2();

        boids.forEach(other => {
            if (other === this ||
                Vector2.dist(this.position, other.position) > this.perceptionR)
                return;

            avgVelocity.add(other.velocity);
            boidCount++;
        });

        if (boidCount == 0) return;

        avgVelocity.div(boidCount);
        avgVelocity.sub(this.velocity); // dis idk why think bout it!
        avgVelocity.limit(this.maxSteerForce);


        this.acceleration.add(avgVelocity);
    }

    // what's the verb for this????
    cohesion(boids) {
        let boidCount = 0;
        let avgPosition = new Vector2();

        boids.forEach(other => {
            if (other === this ||
                Vector2.dist(this.position, other.position) > this.perceptionR)
                return;

            avgPosition.add(other.position);
            boidCount++;
        });
        
        if (boidCount == 0) return;
        
        avgPosition.div(boidCount);

        let steering = avgPosition.sub(this.position);
        steering.setMag(this.maxSpeed);
        steering.sub(this.velocity);

        steering.limit(this.maxSteerForce);
        this.acceleration.add(steering);
    }
}
