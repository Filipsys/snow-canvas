const canvasElement = document.getElementById("root");
const context = canvasElement.getContext("2d");

if (!canvasElement || !context) throw new Error("Canvas-related issue found");

const canvasWidth = context.canvas.width;
const canvasHeight = context.canvas.height;
const timeBetweenParticles = 100;
let numberOfTotalParticlesLogged = 0;
let currentTimeBetween = 0;
let particles = [];

const generateNewParticle = () => {
  const coinToss = Math.random();
  numberOfTotalParticlesLogged += 1; // Increase the total particles (using it as the id)

  particles.push({
    id: numberOfTotalParticlesLogged,
    x: coinToss >= 0.5 ? canvasWidth * Math.random() : 0,
    y: coinToss < 0.5 ? canvasHeight * Math.random() : 0,
    size: 3 * Math.random() + 0.01,
    opacity: 0,
    lifetime: 2000 * Math.random() + 1000,
    speed: 2 * Math.random() + 1,
    sway: 1 * Math.random() + 1,
    appearDate: Date.now(),
  });
};

const updateLoop = () => {
  // Check if a new particle should be made
  if (currentTimeBetween < timeBetweenParticles) {
    currentTimeBetween += 10;
  } else {
    currentTimeBetween = 0;
    generateNewParticle();
  }

  if (!particles.length) return;
  const currentDate = Date.now();

  const isOutOfBounds = (particle) =>
    particle.x + particle.sway < 0 ||
    particle.y + particle.sway < 0 ||
    particle.x + particle.sway > canvasWidth ||
    particle.y + particle.speed > canvasHeight;

  particles = particles.filter((particle) => {
    if (particle.appearDate + particle.lifetime - currentDate > 300 && particle.opacity < 1) {
      particle.opacity += 0.005;
    }

    // Change new particle position
    particle.x += particle.sway;
    particle.y += particle.speed;

    return particle.opacity > 0 && !isOutOfBounds(particle);
  });
};

const drawLoop = () => {
  context.clearRect(0, 0, canvasWidth, canvasHeight);

  particles.forEach((particle) => {
    context.fillStyle = `rgba(0, 0, 0, ${particle.opacity})`;
    context.beginPath();
    context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2, true);
    context.fill();
  });
};

const animationLoop = () => {
  updateLoop();
  drawLoop();
  requestAnimationFrame(animationLoop);
};

window.requestAnimationFrame(animationLoop);
