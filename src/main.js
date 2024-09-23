import { resize } from "./utils/utils.js";
import { Boid } from "./boid.js";

let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
window.canvas = canvas;

let boids = [];

boids.push(new Boid());

window.onresize = () => {
    resize(canvas);
};

const start = () => {
    resize(canvas);
};

const draw = () => {
    requestAnimationFrame(draw);

    ctx.fillStyle = "#2a2b2c";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    boids.map(boid => {
        boid.update();
        boid.draw(ctx);
    })
};

start();
draw();
