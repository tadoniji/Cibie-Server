/**
 * Script de test pour simuler une requête Android
 * Utilise le fetch natif de Node.js
 * Lancez d'abord le serveur (npm start) puis exécutez : node test-request.js
 */

async function testHandshake() {
  const payload = {
    username: "TestUser_123",
    h3Index: "891f1d48803ffff"
  };

  console.log("Envoi de la requête de handshake...");

  try {
    const response = await fetch('http://localhost:3000/auth/handshake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log("✅ Succès ! Jeton reçu :");
      console.log(data);
    } else {
      console.log("❌ Erreur :", data.error);
    }
  } catch (err) {
    console.log("❌ Impossible de contacter le serveur. Est-il lancé ?");
  }
}

testHandshake();
