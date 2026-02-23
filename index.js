import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AccessToken, RoomServiceClient } from 'livekit-server-sdk';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Initialisation du client RoomService pour LiveKit (utilisé pour userCount)
const roomService = new RoomServiceClient(
  process.env.LIVEKIT_URL || '',
  process.env.LIVEKIT_API_KEY || '',
  process.env.LIVEKIT_API_SECRET || ''
);

// Route de santé (Healthcheck)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Serveur de relais Cibie opérationnel' });
});

/**
 * Endpoint : GET /get_token
 * Paramètres Query : zone, identity
 */
app.get('/get_token', async (req, res) => {
  const { zone, identity } = req.query;

  if (!zone || !identity) {
    return res.status(400).json({ 
      error: 'Les paramètres "zone" et "identity" sont requis.' 
    });
  }

  console.log(`[GetToken] Requête reçue - Zone: ${zone}, Identity: ${identity}`);

  try {
    // Génération du token LiveKit
    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      { identity: identity, ttl: '4h' }
    );

    at.addGrant({
      roomJoin: true,
      room: zone,
      canPublish: true,
      canSubscribe: true,
    });

    const token = await at.toJwt();

    // Récupération du nombre de participants dans la room (userCount)
    let userCount = 0;
    try {
      const participants = await roomService.listParticipants(zone);
      userCount = participants.length;
    } catch (err) {
      console.warn(`[GetToken] Impossible de récupérer le userCount pour la zone ${zone}:`, err.message);
      // On continue même si le userCount échoue, car c'est optionnel
    }

    res.json({
      token,
      userCount
    });

  } catch (error) {
    console.error('[GetToken] Erreur lors de la génération du token:', error);
    res.status(500).json({ error: 'Erreur interne lors de la génération du jeton.' });
  }
});

/**
 * Endpoint de Handshake (Ancien endpoint, conservé pour compatibilité si nécessaire)
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