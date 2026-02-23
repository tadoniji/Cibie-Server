/**
 * Script de test pour le nouvel endpoint /get_token
 * Lancez d'abord le serveur (npm start) puis exécutez : node test-get-token.js
 */

async function testGetToken() {
  const zone = "861f1d48fffffff";
  const identity = "PIERRE-FD23E1";
  const url = `http://localhost:3000/get_token?zone=${zone}&identity=${identity}`;

  console.log(`Envoi de la requête GET vers ${url}...`);

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok) {
      console.log("✅ Succès !");
      console.log("Token:", data.token ? "Présent" : "Manquant");
      console.log("UserCount:", data.userCount);
      console.log("Réponse complète:", JSON.stringify(data, null, 2));
    } else {
      console.log("❌ Erreur :", data.error || data);
    }
  } catch (err) {
    console.error("❌ Impossible de contacter le serveur. Est-il lancé ?", err.message);
  }
}

testGetToken();
