export class Vector2 {
    constructor(...args) {
        let x, y;
        x = args[0] || 0;
        y = args[1] || 0;

        this.x = x;
        this.y = y;
    }

    static dist(v1, v2) {
        return Math.sqrt(((v2.x - v1.x) ** 2) + ((v2.y - v1.y) ** 2));
    }

    draw(ctx, pos, color = 'red') {
        ctx.save();

        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.fillStyle = color;

        ctx.translate(pos.x, pos.y);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();

        const angle = this.heading();
        ctx.rotate(angle);

        let arrowSize = 7;
        ctx.translate(this.getMag() - arrowSize, 0);

        ctx.beginPath();
        ctx.moveTo(0, arrowSize / 2);
        ctx.lineTo(0, -arrowSize / 2);
        ctx.lineTo(arrowSize, 0);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

    toString() {
        return `Vector2: { x: ${this.x}, y: ${this.y} }`;
    }

    add(...args) {
        if (args[0] instanceof Vector2) {
            let v2 = args[0];
            this.x += v2.x || 0;
            this.y += v2.y || 0;

            return this;
        }

        if (args.length == 1) {
            this.x += args[0];
            this.y += args[0];

            return this;
        }

        this.x += args[0];
        this.y += args[1];

        return this;
    }

    sub(...args) {
        if (args[0] instanceof Vector2) {
            let v2 = args[0];
            this.x -= v2.x || 0;
            this.y -= v2.y || 0;

            return this;
        }

        if (args.length == 1) {
            this.x -= args[0];
            this.y -= args[0];

            return this;
        }

        this.x -= args[0];
        this.y -= args[1];

        return this;
    }

    mult(...args) {
        if (args[0] instanceof Vector2) {
            let v2 = args[0];
            this.x *= v2.x || 0;
            this.y *= v2.y || 0;

            return this;
        }

        if (args.length == 1) {
            this.x *= args[0];
            this.y *= args[0];

            return this;
        }

        this.x *= args[0];
        this.y *= args[1];

        return this;
    }

    div(...args) {
        if (args[0] instanceof Vector2) {
            let v2 = args[0];
            this.x /= v2.x || 0;
            this.y /= v2.y || 0;

            return this;
        }

        if (args.length == 1) {
            this.x /= args[0];
            this.y /= args[0];

            return this;
        }

        this.x /= args[0];
        this.y /= args[1];

        return this;
    }

    setMag(x) {
        this.normalize().mult(x);
        return this;
    }

    getMag() {
        // ||v|| = sqrt{vx^2 + vy^2}
        // basically pythagoras

        let x = this.x;
        let y = this.y;
        return Math.sqrt(x * x + y * y);
    }

    normalize() {
        // https://www.fundza.com/vectors/normalize/
        // x = vx/||v||
        // y = vy/||v||
        // so
        // v = v/||v||
        let mag = this.getMag();

        if (mag <= 0)
            return this;

        return this.div(mag);
    }

    // man u were a dumbass and limited the x and y not the mag
    limit(n) {
        let mag = this.getMag();

        if (mag > n) {
            this.setMag(n);
        }

        return this;
    }

    heading() {
        // u've done math in school u know dis
        return Math.atan2(this.y, this.x);
        // think bout it atan will give u max pi/2 (90°)
        // lim x -> ∞ arctan(x) = 90°
    }
}
