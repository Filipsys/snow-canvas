const canvasWidth = 600;
const canvasHeight = 600;
let particles = [];
let numberOfTotalParticlesLogged = 0;
const timeBetweenParticles = 100;
let currentTimeBetween = 0;

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
    constructor(id, x, y, size, opacity, lifetime, appearDate, speed, sway) {
      this.id = id;
      this.x = x;
      this.y = y;
      this.size = size;
      this.opacity = opacity;
      this.speed = speed;
      this.sway = sway;
      this.lifetime = lifetime;
      this.appearDate = appearDate;
    }

    fall() {
      this.x += this.sway;
      this.y += this.speed;

      if (this.x + this.sway < 0 || this.x + this.sway > canvasWidth || this.y + this.speed > canvasHeight) {
        particles.splice(particles.indexOf(this), 1);
        return;
      }

      context.fillStyle = `rgb(0 0 0 / ${this.opacity * 100}%)`;
      context.beginPath();
      context.arc(this.x, this.y, this.size, 0, Math.PI * 2, true);
      context.fill();

      context.translate(this.sway, this.speed);
    }
  }

  // particles.push(new Particle(1, 60, 60, 5, 1, 1000, Date.now(), 1, 0.1));
  // particles.push(new Particle(2, 120, 60, 7, 1, 3000, Date.now(), 2, 0.5));
  // particles.push(new Particle(3, 180, 60, 3, 1, 5000, Date.now(), 1, 0.2));
  // particles.push(new Particle(4, 240, 60, 2, 1, 8000, Date.now(), 2, -0.3));

  const generateNewParticle = () => {
    numberOfTotalParticlesLogged += 1;

    const randomX = 600 * Math.random();
    const randomY = 600 * Math.random();
    const randomSize = 5 * Math.random() + 0.01;
    const randomLifetime = 3000 * Math.random() + 2000;
    const randomSpeed = 4 * Math.random() + 1;
    const randomSway = 4 * Math.random() + 1;
    const swayDirectionAndSway = -randomSway ? Math.random() >= 0.5 : randomSway;

    particles.push(
      new Particle(
        numberOfTotalParticlesLogged,
        randomX,
        randomY,
        randomSize,
        0,
        randomLifetime,
        Date.now(),
        randomSpeed,
        swayDirectionAndSway
      )
    );
  };

  const updateLoop = () => {
    if (!particles.length) return;
    const currentDate = Date.now();

    particles.forEach((particle) => {
      if (particle.opacity < 0) {
        particles.splice(particles.indexOf(particle), 1);
        return;
      }

      if (particle.appearDate + particle.lifetime - currentDate > 300 && particle.opacity < 1) {
        particle.opacity += 0.01;
      } else if (particle.appearDate + particle.lifetime < currentDate) {
        particle.opacity -= 0.01;
      }

      particle.fall();
    });
  };

  const animationLoop = () => {
    requestAnimationFrame(animationLoop);

    context.clearRect(0, 0, canvasWidth, canvasHeight);
    context.save();

    if (currentTimeBetween < timeBetweenParticles) {
      currentTimeBetween += 10;
    } else {
      currentTimeBetween = 0;

      generateNewParticle();
    }

    updateLoop();
    context.restore();
  };

  window.requestAnimationFrame(animationLoop);
};

window.addEventListener("DOMContentLoaded", initialize);
