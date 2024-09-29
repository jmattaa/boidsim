import { resize } from "./utils/utils.js";
import { Boid } from "./boid.js";

let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
window.canvas = canvas;

let boids = [];

window.onresize = () => {
    resize(canvas);
};

window.onmousedown = (e) => {
    boids.push(new Boid(e.clientX, e.clientY));
}

const start = () => {
    resize(canvas);

    for (let i = 0; i < 250; i++) {
        boids.push(new Boid());
    }
};

const draw = () => {
    requestAnimationFrame(draw);

    ctx.fillStyle = "#2a2b2c";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    boids.map(boid => {
        boid.update(boids, ctx);
        boid.draw(ctx);
    })
};

start();
draw();
