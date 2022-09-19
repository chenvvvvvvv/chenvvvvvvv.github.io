
// JS is for dynamically creating and moving the birds across the screen.
// The actual bird flapping and flight wave is CSS animation.
// Adjust these options here to customize the scene.
let options = {
delay: 500,
speedRange: [2, 5],
angleRange: [-30, 30],
sizeRange: [8, 30]
};
let bird = document.createElement('span');
bird.className = 'bird';
let particles = [];
setInterval(() => {
let newBird = bird.cloneNode();
const size = rand(options.sizeRange[0], options.sizeRange[1]);
newBird.style.width = size + 'px';
newBird.style.height = (size / 5) + 'px';
document.body.appendChild(newBird);
particles.push(new Particle(newBird, {
speed: rand(options.speedRange[0], options.speedRange[1]),
angle: rand(options.angleRange[0], options.angleRange[1]),
pos: [-100, rand(0, window.innerHeight)]
}));
}, options.delay);
window.requestAnimationFrame(draw);

function draw() {
particles.forEach((particle, i, arr) => {
if (particle.pos[0] > window.innerWidth || particle.pos[1] > window.innerHeight || particle.pos[0] < 0 - window.innerWidth || particle.pos[1] < 0 - window.innerHeight) {
    particle.element.parentNode.removeChild(particle.element);
    arr.splice(i, 1);
}
particle.move();
});
window.requestAnimationFrame(draw);
}

function Particle(element, options) {
this.size = 1;
this.speed = 1;
this.angle = 90;
this.pos = [0, 0];
this.element = element;
this.constructor = function(options) {
for (let i in options) {
    this[i] = options[i];
}
}
this.move = function() {
var radians = this.angle * Math.PI / 180;
this.pos[0] += Math.cos(radians) * this.speed,
    this.pos[1] += Math.sin(radians) * this.speed;
this.draw();
}
this.draw = function() {
this.element.style.left = this.pos[0] + 'px';
this.element.style.top = this.pos[1] + 'px';
}
this.constructor(options);
}

function rand(min, max) {
return Math.random() * (max - min) + min;
}
// Waves from a previous pen: https://codepen.io/lemmin/pen/mdrGYaW
// Create canvas.
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
// Set canvas to the size of the viewable window.
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

// Build three waves with slightly different settings.
let waves = [];
waves.push(new Wave({
frequency: .02,
current: .04,
verticalOffset: 100
}));
waves.push(new Wave({
frequency: .02,
current: .032,
amplitude: 25,
verticalOffset: 120
}));
waves.push(new Wave({
frequency: .025,
current: .03,
amplitude: 15,
verticalOffset: 135
}));
// Draw loop.
drawing();

function drawing() {
ctx.clearRect(0, 0, canvas.width, canvas.height);
waves.forEach(wave => wave.draw());
setTimeout(() => {
window.requestAnimationFrame(drawing);
}, 1);
}

function Wave(options) {
this.options = {
amplitude: 20,
frequency: .05,
current: .01,
verticalOffset: 0,
fillStyle: "#3a99b8",
strokeStyle: "#3a99b8",
...options
};
this.tick = 0;
this.draw = function() {
ctx.shadowColor = "#4aA9C8";
ctx.shadowBlur = 6;
ctx.shadowOffsetX = 0;
ctx.shadowOffsetY = 2;
ctx.strokeStyle = this.options.strokeStyle;
ctx.fillStyle = this.options.fillStyle;
ctx.beginPath();
// Move to first coordinate.
ctx.moveTo(0, getY(0));
// Draw the wave across the x axis.
for (let x = 1; x < canvas.width; x++) {
    ctx.lineTo(x, getY(x));
}
ctx.stroke();
// Close the shape around the bottom of the canvas.
ctx.lineTo(canvas.width, canvas.height);
ctx.lineTo(0, canvas.height);
ctx.closePath();
ctx.fill();
this.tick += this.options.current;
}
const getY = x => {
// Offset by half the canvas to start, and add the extra offset at the end.
return (canvas.height / 2 - (Math.cos(x * this.options.frequency - this.tick) * this.options.amplitude * Math.cos(this.tick))) + Math.sin(this.tick) * (this.options.amplitude / 2) + this.options.verticalOffset;
}
}
