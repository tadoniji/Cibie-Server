# Cibie-Back : Serveur de Relais LiveKit (ProxChat)

Ce serveur Node.js agit comme un relais d'authentification entre l'application Android **Cibie** et l'infrastructure **LiveKit**. Il permet de générer des jetons d'accès sécurisés basés sur des IDs de zone.

## Fonctionnement du Relais

1. L'application Android détecte la position de l'utilisateur et identifie la zone correspondante (Zone ID).
2. L'application envoie une requête à ce serveur avec son `identity` et le `zone` ID.
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

### Obtenir un Token (Recommandé)
- **URL** : `/get_token`
- **Méthode** : `GET`
- **Paramètres Query** :
  - `zone` : Identifiant de la zone (Zone ID)
  - `identity` : Pseudo + ID unique (ex: `PIERRE-FD23E1`)
- **Réponse (JSON)** :
  ```json
  {
    "token": "eyJhbG...",
    "userCount": 5
  }
  ```

### Handshake (Legacy - H3)
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
