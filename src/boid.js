import { getRandRgb } from "./utils/utils.js";
import { Vector2 } from "./utils/vector2.js";

const SEPARATE_FORCE = 1.5;
const ALIGN_FORCE = 1.1;
const COHESION_FORCE = 1;

const MAX_SPEED = 4.0;
const MAX_STEER_FORCE = 2 * 0.07; // the name's bond, james bond
const PERCEPTION_RADIUS = 30;
// const PERCEPTION_ANGLE = Math.PI / 2;
const BOID_SIZE = 3.0;

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
    }

    update(boids) {
        let separateForce = this.separate(boids).mult(SEPARATE_FORCE);
        let alignForce = this.align(boids).mult(ALIGN_FORCE);
        let cohesionForce = this.cohesion(boids).mult(COHESION_FORCE);

        this.acceleration.add(separateForce);
        this.acceleration.add(alignForce);
        this.acceleration.add(cohesionForce);

        this.velocity.add(this.acceleration);
        this.velocity.limit(MAX_SPEED);
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
        ctx.moveTo(0, -BOID_SIZE * 2);
        ctx.lineTo(-BOID_SIZE, BOID_SIZE * 2);
        ctx.lineTo(BOID_SIZE, BOID_SIZE * 2);
        ctx.closePath();

        ctx.fill();
        ctx.stroke();

        // cuz sometimes me wanna see
        //ctx.fillStyle = "rgba(1, 1, 1, .3)"
        //ctx.arc(0, 0, PERCEPTION_RADIUS, 0, Math.PI * 2);
        //ctx.fill()

        ctx.restore();
    }

    wrap() {
        if (this.position.x < -BOID_SIZE) {
            this.position.x = window.canvas.width + BOID_SIZE;
        }

        if (this.position.y < -BOID_SIZE) {
            this.position.y = window.canvas.height + BOID_SIZE;
        }

        if (this.position.x > window.canvas.width + BOID_SIZE) {
            this.position.x = -BOID_SIZE;
        }

        if (this.position.y > window.canvas.height + BOID_SIZE) {
            this.position.y = -BOID_SIZE;
        }
    }

    isInPerception(other) {
        return Vector2.dist(this.position, other.position) <= PERCEPTION_RADIUS;
    }

    separate(boids) {
        let boidCount = 0;
        let sum = new Vector2();

        const dist = BOID_SIZE * 4;

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
        sum.limit(MAX_STEER_FORCE);

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
        avgVelocity.limit(MAX_STEER_FORCE);

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
        steering.setMag(MAX_SPEED);
        steering.sub(this.velocity);
        steering.limit(MAX_STEER_FORCE);

        return steering;
    }
}
