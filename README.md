# Cibie-Back : Serveur de Relais LiveKit (ProxChat H3)

Ce serveur Node.js agit comme un relais d'authentification entre l'application Android **Cibie** et l'infrastructure **LiveKit**. Il permet de générer des jetons d'accès sécurisés basés sur le quadrillage géographique H3.

## Fonctionnement du Relais

1. L'application Android détecte la position de l'utilisateur et calcule l'index H3 correspondant.
2. L'application envoie un **Handshake** à ce serveur avec son `username` et le `h3Index`.
3. Ce serveur valide la demande et génère un jeton (JWT) signé via le SDK LiveKit.
4. L'application reçoit le jeton et se connecte **directement** au serveur LiveKit pour l'audio.

## Configuration

1. Installez les dépendances :
   ```bash
   npm install
   ```

2. Créez un fichier `.env` à la racine :
   ```env
   LIVEKIT_API_KEY=votre_api_key
   LIVEKIT_API_SECRET=votre_api_secret
   LIVEKIT_URL=wss://votre-projet.livekit.cloud
   PORT=3000
   ```

3. Lancez le serveur :
   ```bash
   npm start
   ```

## API

### Handshake (Authentification)
- **URL** : `/auth/handshake`
- **Méthode** : `POST`
- **Corps (JSON)** :
  ```json
  {
    "username": "NomUtilisateur",
    "h3Index": "891f1d48803ffff"
  }
  ```
- **Réponse (JSON)** :
  ```json
  {
    "token": "ey...",
    "livekit_url": "wss://...",
    "room_name": "cibie_h3_891f1d48803ffff"
  }
  ```

### Santé
- **URL** : `/health`
- **Méthode** : `GET`
