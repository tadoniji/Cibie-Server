/**
 * Script de Keep-Alive pour Render (Plan Gratuit)
 * Ce script appelle la route /health toutes les 10 minutes
 * pour empêcher le serveur de s'endormir.
 */

const URL = 'https://VOTRE-APP-RENDER.onrender.com/health';
const INTERVAL = 10 * 60 * 1000; // 10 minutes

function poke() {
  console.log(`[Keep-Alive] Ping du serveur à ${new Date().toISOString()}...`);
  fetch(URL)
    .then(res => console.log(`[Keep-Alive] Réponse: ${res.status}`))
    .catch(err => console.error(`[Keep-Alive] Erreur: ${err.message}`));
}

// Premier ping immédiat
poke();

// Intervalle régulier
setInterval(poke, INTERVAL);
