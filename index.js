import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AccessToken } from 'livekit-server-sdk';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Route de santé (Healthcheck)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Serveur de relais Cibie opérationnel' });
});

/**
 * Endpoint de Handshake (Relais d'Authentification)
 */
app.post('/auth/handshake', async (req, res) => {
  const { username, h3Index } = req.body;
  console.log(`[Handshake] Requête reçue pour l'utilisateur: ${username}, H3 Index: ${h3Index}`);

  // Sécurité : Timeout de 10 secondes pour informer l'appli
  let isRequestHandled = false;
  const timeout = setTimeout(() => {
    if (!isRequestHandled) {
      isRequestHandled = true;
      res.status(202).json({ 
        message: 'Le serveur est en cours de réveil ou de traitement, veuillez patienter...',
        retry_after: 5
      });
    }
  }, 10000);

  if (!username || !h3Index) {
    clearTimeout(timeout);
    isRequestHandled = true;
    return res.status(400).json({ 
      error: 'Identifiant utilisateur (username) et index H3 (h3Index) requis.' 
    });
  }

  try {
    // ... reste de la logique ...
    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      { identity: username, ttl: '4h' }
    );

    at.addGrant({
      roomJoin: true,
      room: `cibie_h3_${h3Index}`,
      canPublish: true,
      canSubscribe: true,
    });

    const token = await at.toJwt();

    if (!isRequestHandled) {
      clearTimeout(timeout);
      isRequestHandled = true;
      res.json({
        token,
        livekit_url: process.env.LIVEKIT_URL,
        room_name: `cibie_h3_${h3Index}`
      });
    }

  } catch (error) {
    if (!isRequestHandled) {
      clearTimeout(timeout);
      isRequestHandled = true;
      console.error('Erreur lors du handshake LiveKit:', error);
      res.status(500).json({ error: 'Erreur interne lors de la génération du jeton.' });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Serveur de relais Cibie démarré sur le port ${PORT}`);
});