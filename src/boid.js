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
        this.velocity.setMag((Math.random() * 6) + 2);

        this.color = getRandRgb();
        this.size = 2.5;
    }

    update() {
        this.position.add(this.velocity);

        this.wrap();
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
}
