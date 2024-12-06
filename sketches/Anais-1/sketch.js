import { createIframeClient } from "../../shared/engine/iframeClient.js";
const iframeClient = createIframeClient();
function finish() {
  iframeClient.sendFinishSignal();
}

const canvas = document.getElementById("scratchCanvas");
const ctx = canvas.getContext("2d");

const confettiCanvas = document.getElementById("confettiCanvas");
const confettiCtx = confettiCanvas.getContext("2d");

// Ajuste la taille des canvases
canvas.width = confettiCanvas.width = window.innerWidth;
canvas.height = confettiCanvas.height = window.innerHeight;

// Couche initiale à gratter
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Définir la zone contenant le "1"
const numberArea = {
  x: canvas.width * 0.7,
  y: canvas.height * 0.4,
  width: canvas.width * 0.2,
  height: canvas.height * 0.2,
};

let isScratching = false;
let confetti = []; // Tableau pour stocker les confettis
let confettiActive = false; // Variable pour vérifier si les confettis sont actifs
let confettiTimeout; // Timer pour arrêter les confettis après 2 secondes

// Fonction pour gérer le grattage
function scratch(e) {
  if (!isScratching) return;

  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX || e.touches[0].clientX) - rect.left;
  const y = (e.clientY || e.touches[0].clientY) - rect.top;

  // Dessine un cercle transparent là où on gratte
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(x, y, 30, 0, Math.PI * 2);
  ctx.fill();
}

// Vérifier si la zone contenant le "1" est grattée
function checkNumberArea() {
  try {
    const imageData = ctx.getImageData(
      numberArea.x,
      numberArea.y,
      numberArea.width,
      numberArea.height
    ).data;

    let scratchedPixels = 0;
    for (let i = 0; i < imageData.length; i += 4) {
      if (imageData[i + 3] === 0) scratchedPixels++;
    }

    const totalPixels = numberArea.width * numberArea.height;
    const scratchedRatio = scratchedPixels / totalPixels;

    if (scratchedRatio > 0.3 && !confettiActive) {
      // S'assurer que les confettis ne redémarrent pas
      canvas.style.display = "none"; // Cache le canvas de grattage
      startConfetti(); // Lance les confettis
    }
  } catch (error) {
    console.error("Erreur lors de la vérification de la zone :", error);
  }
}

// Démarrer/arrêter le grattage
canvas.addEventListener("mousedown", () => (isScratching = true));
canvas.addEventListener("mouseup", () => (isScratching = false));
canvas.addEventListener("mousemove", scratch);
canvas.addEventListener("touchstart", () => (isScratching = true));
canvas.addEventListener("touchend", () => (isScratching = false));
canvas.addEventListener("touchmove", scratch);

// Vérification régulière de l'état de la zone cible
setInterval(checkNumberArea, 100);

// === ANIMATION DES CONFETTIS === //
function startConfetti() {
  if (confettiActive) return; // Evite de redémarrer les confettis si déjà actifs
  confettiActive = true;

  // Créer des confettis
  for (let i = 0; i < 40; i++) {
    confetti.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height,
      r: Math.random() * 2 + 2, // Taille du confetti
      dx: Math.random() * 4 - 2, // Direction horizontale
      dy: Math.random() * 4 + 2, // Direction verticale
      color: `hsl(${Math.random() * 360}, 100%, 50%)`, // Couleur aléatoire
    });
  }

  requestAnimationFrame(animateConfetti);

  // Arrêter les confettis après 2 secondes
  confettiTimeout = setTimeout(() => {
    stopConfetti(); // Stoppe l'animation des confettis
    setTimeout(() => {
      document.querySelector(".screen").style.background = "black"; // Transition vers l'écran noir
      // Faire disparaître le canvas de confettis et autres éléments après 2 secondes
      confettiCanvas.style.display = "none"; // Cache le canvas des confettis
      canvas.style.display = "none"; // Cache également le canvas de grattage
      finish(); // Appeler la fonction finish() ici
    }, 20); // Petit délai pour l'écran noir
  }, 2000); // Les confettis apparaissent pendant 2 secondes
}

function animateConfetti() {
  if (!confettiActive) return; // Si les confettis sont arrêtés, on arrête l'animation
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  // Fonction finish pour finaliser l'expérience
  function finish() {
    // Code à exécuter lorsque l'écran devient noir
    console.log("Transition terminée, expérience finie !");
  }
  confetti.forEach((c) => {
    confettiCtx.beginPath();
    confettiCtx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    confettiCtx.fillStyle = c.color;
    confettiCtx.fill();

    // Mise à jour de la position
    c.x += c.dx;
    c.y += c.dy;

    // Réinitialiser les confettis sortis de l'écran
    if (c.y > confettiCanvas.height) c.y = -0;
    if (c.x > confettiCanvas.width || c.x < 0) c.dx = -c.dx;
  });

  requestAnimationFrame(animateConfetti);
}

function stopConfetti() {
  confettiActive = false; // Empêche les confettis de continuer à tomber
  clearTimeout(confettiTimeout); // Annule tout timeout restant
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height); // Efface les confettis
}
