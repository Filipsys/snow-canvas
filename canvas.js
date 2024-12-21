const canvasWidth = 600;
const canvasHeight = 600;
// const gravity = 1;
// const weight = 1;
// const speed = 0;
let particles = [];

const initialize = () => {
  const canvasElement = document.getElementById("root");
  if (!canvasElement) {
    console.error("Canvas element not found");
    return;
  }

  const context = canvasElement.getContext("2d");
  if (!context) {
    console.error("Canvas context not available");
    return;
  }

  class Particle {
    constructor(id, x, y, size, opacity, lifetime, speed, sway) {
      this.id = id;
      this.x = x;
      this.y = y;
      this.size = size;
      this.opacity = opacity;
      this.speed = speed;
      this.sway = sway;
      this.lifetime = lifetime;
      context.fillStyle = `rgb(0 0 0 / ${opacity * 100}%)`;
    }

    fall() {
      this.x += this.sway;
      this.y += this.speed;

      context.fillStyle = `rgb(0 0 0 / ${this.opacity * 100}%)`;
      context.beginPath();
      context.arc(this.x, this.y, this.size, 0, Math.PI * 2, true);
      context.fill();

      context.translate(this.sway, this.speed);
    }
  }

  particles.push(new Particle(1, 60, 60, 5, 1, 3000, 1, 0.1));
  particles.push(new Particle(2, 120, 60, 7, 1, 3000, 2, 0.5));
  particles.push(new Particle(3, 180, 60, 3, 1, 3000, 1, 0.2));
  particles.push(new Particle(4, 240, 60, 2, 1, 3000, 2, -0.3));

  const updateLoop = () => {
    console.log("In update loop");

    particles.forEach((particle) => {
      if (particle.opacity < 0) return particles.splice(particles.indexOf(this.id), 1);

      particle.opacity -= 0.01;
    });
  };

  const animationLoop = () => {
    requestAnimationFrame(animationLoop);
    console.log("In animation loop");

    updateLoop();

    context.clearRect(0, 0, canvasWidth, canvasHeight);
    context.save();

    particles.forEach((particle) => particle.fall());
    context.restore();
  };

  window.requestAnimationFrame(animationLoop);
};

window.addEventListener("DOMContentLoaded", initialize);
