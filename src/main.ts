const sizeSlider = document.getElementById("size-slider");
const speedSlider = document.getElementById("speed-slider");
const swaySlider = document.getElementById("sway-slider");
const lifetimeSlider = document.getElementById("lifetime-slider");
const amountSlider = document.getElementById("amount-slider");
const maximalOpacitySlider = document.getElementById("maximal-opacity-slider");
const randomnessSlider = document.getElementById("randomness-slider");
const particleColorInput = document.getElementById("particle-color-input");
const backgroundColorInput = document.getElementById("background-color-input");
const leftDirectionButton = document.getElementById("direction-left");
const rightDirectionButton = document.getElementById("direction-right");

let sizeVariable = 1;
let speedVariable = 3;
let swayVariable = 0;
let lifetimeVariable = 1000;
let amountVariable = 1000;
let maximalOpacity = 1;
let randomnessVariable = 0;
let canvasColor = "#FFFFFF";
let particlesColor = "#000000";
let particleDirection = "right";

sizeSlider?.addEventListener("input", (event) => (sizeVariable = parseFloat((event.target as HTMLInputElement).value)));
speedSlider?.addEventListener(
  "input",
  (event) => (speedVariable = parseFloat((event.target as HTMLInputElement).value))
);
swaySlider?.addEventListener("input", (event) => (swayVariable = parseFloat((event.target as HTMLInputElement).value)));
lifetimeSlider?.addEventListener(
  "input",
  (event) => (lifetimeVariable = parseFloat((event.target as HTMLInputElement).value))
);
amountSlider?.addEventListener(
  "input",
  (event) => (amountVariable = parseInt((event.target as HTMLInputElement).value))
);
maximalOpacitySlider?.addEventListener(
  "input",
  (event) => (maximalOpacity = parseFloat((event.target as HTMLInputElement).value))
);
randomnessSlider?.addEventListener(
  "input",
  (event) => (randomnessVariable = parseFloat((event.target as HTMLInputElement).value))
);
particleColorInput?.addEventListener("input", (event) => (particlesColor = (event.target as HTMLInputElement).value));
backgroundColorInput?.addEventListener("input", (event) => (canvasColor = (event.target as HTMLInputElement).value));
leftDirectionButton?.addEventListener("click", () => (particleDirection = "left"));
rightDirectionButton?.addEventListener("click", () => (particleDirection = "right"));

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  lifetime: number;
  speed: number;
  sway: number;
  appearDate: number;
}

const canvasElement = document.getElementById("root") as HTMLCanvasElement;
if (!canvasElement) throw new Error("Canvas-related issue found");
const context = canvasElement.getContext("2d") as CanvasRenderingContext2D;
if (!context) throw new Error("Canvas-related issue found");

const canvasWidth = context.canvas.width;
const canvasHeight = context.canvas.height;
let numberOfTotalParticlesLogged = 0;
let particles: Particle[] = [];

const hexToRGB = (hexColor: string) => {
  const hexList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"];
  hexColor = hexColor.toUpperCase();
  let hexColours = { red: "", green: "", blue: "" };

  if (hexColor.length == 4) {
    hexColours = {
      red: hexColor.slice(1, 1),
      green: hexColor.slice(2, 2),
      blue: hexColor.slice(3, 3),
    };
  } else if (hexColor.length == 7) {
    hexColours = {
      red: hexColor.slice(1, 3),
      green: hexColor.slice(3, 5),
      blue: hexColor.slice(5, 7),
    };
  }

  return {
    red: hexList.indexOf(hexColours.red.slice(1)) * 16 + hexList.indexOf(hexColours.red.slice(-1)),
    green: hexList.indexOf(hexColours.green.slice(1)) * 16 + hexList.indexOf(hexColours.green.slice(-1)),
    blue: hexList.indexOf(hexColours.blue.slice(1)) * 16 + hexList.indexOf(hexColours.blue.slice(-1)),
  };
};

const generateNewParticle = () => {
  numberOfTotalParticlesLogged += 1;
  const coinToss = Math.random();

  let randomnessApply = randomnessVariable;
  if (randomnessVariable == 0) {
    randomnessApply = 1;
  } else {
    randomnessApply = randomnessVariable * Math.random();
    Math.random() >= 0.5 ? null : (randomnessApply = -randomnessApply);
  }

  particles.push({
    id: numberOfTotalParticlesLogged,
    x:
      particleDirection == "right"
        ? coinToss >= 0.5
          ? canvasWidth * Math.random()
          : 0
        : coinToss >= 0.5
        ? canvasWidth * Math.random()
        : canvasWidth,
    y:
      particleDirection == "right"
        ? coinToss < 0.5
          ? canvasHeight * Math.random()
          : 0
        : coinToss < 0.5
        ? canvasHeight * Math.random()
        : 0,

    size: sizeVariable + (randomnessApply > 0 ? randomnessApply : -randomnessApply),
    opacity: 0,
    lifetime: lifetimeVariable,
    speed: speedVariable + randomnessApply,
    sway: swayVariable + randomnessApply,
    appearDate: Date.now(),
  });
};

const updateLoop = () => {
  // Check if a new particle should be made
  if (particles.length < amountVariable) {
    for (let i = 0; i < amountVariable - particles.length; i++) {
      generateNewParticle();
    }
  }

  if (!particles.length) return;
  const currentDate = Date.now();

  const isOutOfBounds = (particle: Particle) =>
    particle.x + particle.sway < 0 ||
    particle.y + particle.sway < 0 ||
    particle.x + particle.sway > canvasWidth ||
    particle.y + particle.speed > canvasHeight;

  particles = particles.filter((particle) => {
    if (
      particle.appearDate + particle.lifetime - currentDate > particle.lifetime / 6 &&
      particle.opacity < maximalOpacity
    ) {
      particle.opacity += 0.005;
    }

    // Change new particle position
    particle.x += swayVariable == 0 ? 0 : particleDirection == "right" ? particle.sway : -particle.sway;
    particle.y += particle.speed;

    return particle.opacity > 0 && !isOutOfBounds(particle);
  });
};

const drawLoop = () => {
  context.fillStyle = canvasColor;
  context.fillRect(0, 0, canvasWidth, canvasHeight);

  particles.forEach((particle) => {
    if (particlesColor.length == 4 || particlesColor.length == 7) {
      const { red, green, blue } = hexToRGB(particlesColor);

      context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${particle.opacity})`;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2, true);
      context.fill();
    }
  });
};

const animationLoop = () => {
  updateLoop();
  drawLoop();
  requestAnimationFrame(animationLoop);
};

window.requestAnimationFrame(animationLoop);
