export class Vector2 {
    constructor(...args) {
        let x, y;
        x = args[0] || 0;
        y = args[1] || 0;

        this.x = x;
        this.y = y;
    }

    static createVector(...args) {
        return new Vector2(...args);
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
        return this.normalize().mult(x);
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

    limit(n) {
        this.x > n? this.x = n : null;
        this.y > n? this.y = n : null;

        return this;
    }

    heading() {
        // u've done math in school u know dis
        return Math.atan2(this.y, this.x);
        // think bout it atan will give u max pi/2 (90°)
        // lim x -> ∞ arctan(x) = 90°
    }
}
