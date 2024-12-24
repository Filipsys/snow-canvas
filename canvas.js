const canvasWidth = 600;
const canvasHeight = 600;
const timeBetweenParticles = 100;
let numberOfTotalParticlesLogged = 0;
let currentTimeBetween = 0;
let particles = [];

const generateNewParticle = () => {
  numberOfTotalParticlesLogged += 1; // Increase the total particles (using it as the id)

  // Generate a bunch of random data, duh
  const randomX = 600 * Math.random();
  const randomY = 600 * Math.random();
  const randomSize = 5 * Math.random() + 0.01;
  const randomLifetime = 3000 * Math.random() + 2000;
  const randomSpeed = 4 * Math.random() + 1;
  const randomSway = 4 * Math.random() + 1;
  // const swayDirectionAndSway = -randomSway ? Math.random() >= 0.5 : randomSway;

  particles.push({
    id: numberOfTotalParticlesLogged,
    x: randomX,
    y: randomY,
    size: randomSize,
    opacity: 0,
    lifetime: randomLifetime,
    speed: randomSpeed,
    sway: randomSway,
    appearDate: Date.now(),
  });
};

window.addEventListener("DOMContentLoaded", () => {
  const canvasElement = document.getElementById("root");
  if (!canvasElement) {
    console.error("Canvas element is not found");
    return;
  }

  const context = canvasElement.getContext("2d");
  if (!context) {
    console.error("Canvas context is not available");
    return;
  }

  const updateLoop = () => {
    if (!particles.length) return;
    const currentDate = Date.now();

    particles.forEach((particle) => {
      // If the particle's opacity is below zero, remove it as it is unnecessary
      if (particle.opacity < 0) {
        particles.splice(particles.indexOf(particle), 1);
        return;
      }

      // Check if the particle is new, if so, increase opacity, else decrease it
      if (particle.appearDate + particle.lifetime - currentDate > 300 && particle.opacity < 1) {
        particle.opacity += 0.01;
      } else if (particle.appearDate + particle.lifetime < currentDate) {
        particle.opacity -= 0.01;
      }

      // Change new particle position
      particle.x += particle.sway;
      particle.y += particle.speed;

      // Check if the particle is out of boundaries, if so, remove it
      if (
        particle.x + particle.sway < 0 ||
        particle.x + particle.sway > canvasWidth ||
        particle.y + particle.speed > canvasHeight
      ) {
        particles.splice(particles.indexOf(particle), 1);
        return;
      }
    });
  };

  const animationLoop = () => {
    requestAnimationFrame(animationLoop);

    context.clearRect(0, 0, canvasWidth, canvasHeight);

    // Check if a new particle should be made
    if (currentTimeBetween < timeBetweenParticles) {
      currentTimeBetween += 10;
    } else {
      currentTimeBetween = 0;

      generateNewParticle();
    }

    particles.forEach((particle) => {
      // Draw out the particle & translate it in the direction it's heading in
      context.fillStyle = `rgb(0 0 0 / ${particle.opacity * 100}%)`;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2, true);
      context.fill();
    });

    updateLoop();
  };

  window.requestAnimationFrame(animationLoop);
});
