# Trykitt MCP Server

This project implements a Model Context Protocol (MCP) server that acts as a wrapper around the Trykitt API ([https://trykitt.ai/](https://trykitt.ai/)), a powerful platform designed to find and verify B2B email addresses with exceptional accuracy and speed.

Leverage Trykitt's advanced capabilities directly within your AI workflows. Find more B2B emails than many providers with a near-zero bounce rate, go beyond simple SMTP checks by verifying against enterprise identity servers, and benefit from significantly faster results compared to traditional methods. Verify catchalls, detect job changes, and enhance your outreach efforts.

---

## English

### Overview

This MCP server allows language models (like Claude, ChatGPT, Gemini) to interact with the Trykitt API ([https://trykitt.ai/](https://trykitt.ai/)). It enables your AI assistant to tap into Trykitt's state-of-the-art email finding and verification engine, designed to deliver more valid B2B emails, faster, and with greater reliability (<0.1% bounce rate reported by Trykitt) than many alternatives. Verify catchalls, detect job changes, and enhance your outreach efforts.

### Features

*   Provides MCP tools wrapping the following Trykitt API endpoints:
    *   `GET /job?id={job_id}` (Tool: `get_job`)
    *   `POST /job/find_email` (Tool: `find_email`)
    *   `POST /job/verify_email` (Tool: `verify_email`)
*   Handles API key authentication.
*   Forces real-time processing for `find_email` and `verify_email` jobs.

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm (usually comes with Node.js)
*   A Trykitt API Key

### Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository_url> # Replace with the actual URL
    cd trykitt-mcp
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure API Key:**
    Create a `.env` file in the root of the project:
    ```
    TRYKITT_API_KEY=YOUR_TRYKITT_API_KEY
    ```
    Replace `YOUR_TRYKITT_API_KEY` with your actual Trykitt API key.

### Running the Server

```bash
npm start
```

This will start the MCP server, listening on stdio for connections from an MCP client (e.g., Claude Desktop, Cursor). The server will log its status to stderr.

### Available Tools

*   **`get_job`**: Retrieves the status or result of a previously submitted Trykitt job.
    *   **Parameter**: `job_id` (string, required)
    *   **Minimum JSON Example:**
        ```json
        {
          "tool_name": "get_job",
          "parameters": {
            "job_id": "01JEXAMPLEJOBID"
          }
        }
        ```
*   **`find_email`**: Finds a person's email address.
    *   **Parameters**: `fullName` (string, required), `domainOrWebsite` (string, required), `companyName` (string, optional), `linkedinStandardProfileURL` (string, optional), `callbackType` (string, optional), `callbackURL` (string, optional), `fastMode` (boolean, optional), `customData` (string, optional), `discoverAlternativeDomains` (boolean, optional), `dataProviderFallback` (boolean, optional)
    *   **Minimum JSON Example:**
        ```json
        {
          "tool_name": "find_email",
          "parameters": {
            "fullName": "Erol Toker",
            "domainOrWebsite": "trykitt.ai"
          }
        }
        ```
    *   **Full JSON Example:**
        ```json
        {
          "tool_name": "find_email",
          "parameters": {
            "fullName": "Jane Doe",
            "domainOrWebsite": "https://example.com/",
            "companyName": "Example Corp",
            "linkedinStandardProfileURL": "https://linkedin.com/in/janedoe-example",
            "callbackType": "here",
            "callbackURL": "",
            "fastMode": false,
            "customData": "project_alpha_lead_42",
            "discoverAlternativeDomains": true,
            "dataProviderFallback": true
          }
        }
        ```
*   **`verify_email`**: Verifies if an email address is valid.
    *   **Parameters**: `email` (string, required), `treatAliasesAsValid` (boolean, optional, default: true)
    *   **Minimum JSON Example:**
        ```json
        {
          "tool_name": "verify_email",
          "parameters": {
            "email": "erol@trykitt.ai"
          }
        }
        ```
    *   **Full JSON Example:**
        ```json
        {
          "tool_name": "verify_email",
          "parameters": {
            "email": "erol@trykitt.ai",
            "treatAliasesAsValid": false
          }
        }
        ```

### Client Configuration Example (e.g., Claude Desktop `settings.json`)

To use this server with an MCP client, you need to configure the client to run the server command. Here's an example configuration:

```json
{
  "mcpServers": {
    "trykitt": {
      "command": "node",
      "args": ["/path/to/your/trykitt-mcp/src/index.js"], // IMPORTANT: Replace with the actual absolute path
      "env": {
        "TRYKITT_API_KEY": "YOUR_TRYKITT_API_KEY" // IMPORTANT: Replace with your actual key
      }
    }
  }
}
```

**Important:**

*   Replace `/path/to/your/trykitt-mcp/src/index.js` with the correct **absolute path** to the `index.js` file in your cloned project directory.
*   Replace `YOUR_TRYKITT_API_KEY` with your actual Trykitt API key. You can also omit the `env` block here if you have set the key in a `.env` file within the `trykitt-mcp` project directory itself, as the server will pick it up from there.

---

## Français

### Aperçu

Ce serveur MCP (Model Context Protocol) implémente un wrapper autour de l'API Trykitt ([https://trykitt.ai/](https://trykitt.ai/)), une plateforme puissante conçue pour trouver et vérifier les adresses e-mail B2B avec une précision et une vitesse exceptionnelles.

Tirez parti des capacités avancées de Trykitt directement dans vos workflows d'IA. Trouvez plus d'e-mails B2B que de nombreux fournisseurs avec un taux de rebond quasi nul, allez au-delà des simples vérifications SMTP en validant auprès des serveurs d'identité d'entreprise, et bénéficiez de résultats nettement plus rapides par rapport aux méthodes traditionnelles.

### Fonctionnalités

Ce serveur MCP permet aux modèles de langage (comme Claude, ChatGPT, Gemini) d'interagir avec l'API Trykitt ([https://trykitt.ai/](https://trykitt.ai/)). Il permet à votre assistant IA d'exploiter le moteur de recherche et de vérification d'e-mails de pointe de Trykitt, conçu pour fournir plus d'e-mails B2B valides, plus rapidement et avec une plus grande fiabilité (taux de rebond <0,1% rapporté par Trykitt) que de nombreuses alternatives. Vérifiez les adresses "catchall", détectez les changements de poste et améliorez vos efforts de prospection.

### Caractéristiques

*   Fournit des outils MCP encapsulant les points de terminaison suivants de l'API Trykitt :
    *   `GET /job?id={job_id}` (Outil : `get_job`)
    *   `POST /job/find_email` (Outil : `find_email`)
    *   `POST /job/verify_email` (Outil : `verify_email`)
*   Gère l'authentification par clé API.
*   Force le traitement en temps réel pour les jobs `find_email` et `verify_email`.

### Prérequis

*   Node.js (v18 ou ultérieure recommandée)
*   npm (généralement inclus avec Node.js)
*   Une clé API Trykitt

### Installation

1.  **Cloner le dépôt :**
    ```bash
    git clone <repository_url> # Remplacez par l'URL réelle
    cd trykitt-mcp
    ```
2.  **Installer les dépendances :**
    ```bash
    npm install
    ```
3.  **Configurer la clé API :**
    Créez un fichier `.env` à la racine du projet :
    ```
    TRYKITT_API_KEY=VOTRE_CLE_API_TRYKITT
    ```
    Remplacez `VOTRE_CLE_API_TRYKITT` par votre clé API Trykitt réelle.

### Lancer le Serveur

```bash
npm start
```

Cela démarrera le serveur MCP, qui écoutera sur stdio les connexions d'un client MCP (par exemple, Claude Desktop, Cursor). Le serveur affichera son statut sur stderr.

### Outils Disponibles

*   **`get_job`**: Récupère le statut ou le résultat d'un job Trykitt soumis précédemment.
    *   **Paramètre**: `job_id` (chaîne, requis)
    *   **Exemple JSON minimum :**
        ```json
        {
          "tool_name": "get_job",
          "parameters": {
            "job_id": "01JEXAMPLEJOBID"
          }
        }
        ```
*   **`find_email`**: Trouve l'adresse e-mail d'une personne.
    *   **Paramètres**: `fullName` (chaîne, requis), `domainOrWebsite` (chaîne, requise), `companyName` (chaîne, optionnel), `linkedinStandardProfileURL` (chaîne, optionnel), `callbackType` (chaîne, optionnel), `callbackURL` (chaîne, optionnel), `fastMode` (booléen, optionnel), `customData` (chaîne, optionnel), `discoverAlternativeDomains` (booléen, optionnel), `dataProviderFallback` (booléen, optionnel)
    *   **Exemple JSON minimum :**
        ```json
        {
          "tool_name": "find_email",
          "parameters": {
            "fullName": "Erol Toker",
            "domainOrWebsite": "trykitt.ai"
          }
        }
        ```
    *   **Exemple JSON complet :**
        ```json
        {
          "tool_name": "find_email",
          "parameters": {
            "fullName": "Jeanne Dupont",
            "domainOrWebsite": "https://exemple.fr/",
            "companyName": "Exemple SA",
            "linkedinStandardProfileURL": "https://linkedin.com/in/jeannedupont-exemple",
            "callbackType": "here",
            "callbackURL": "",
            "fastMode": false,
            "customData": "projet_alpha_piste_42",
            "discoverAlternativeDomains": true,
            "dataProviderFallback": true
          }
        }
        ```
*   **`verify_email`**: Vérifie si une adresse e-mail est valide.
    *   **Paramètres**: `email` (chaîne, requis), `treatAliasesAsValid` (booléen, optionnel, défaut: true)
    *   **Exemple JSON minimum :**
        ```json
        {
          "tool_name": "verify_email",
          "parameters": {
            "email": "erol@trykitt.ai"
          }
        }
        ```
    *   **Exemple JSON complet :**
        ```json
        {
          "tool_name": "verify_email",
          "parameters": {
            "email": "erol@trykitt.ai",
            "treatAliasesAsValid": false
          }
        }
        ```

### Exemple de Configuration Client (ex: `settings.json` pour Claude Desktop)

Pour utiliser ce serveur avec un client MCP, vous devez configurer le client pour exécuter la commande du serveur. Voici un exemple de configuration :

```json
{
  "mcpServers": {
    "trykitt": {
      "command": "node",
      "args": ["/chemin/vers/votre/trykitt-mcp/src/index.js"], // IMPORTANT : Remplacez par le chemin absolu réel
      "env": {
        "TRYKITT_API_KEY": "VOTRE_CLE_API_TRYKITT" // IMPORTANT : Remplacez par votre clé réelle
      }
    }
  }
}
```

**Important :**

*   Remplacez `/chemin/vers/votre/trykitt-mcp/src/index.js` par le **chemin absolu** correct vers le fichier `index.js` dans le répertoire de votre projet cloné.
*   Remplacez `VOTRE_CLE_API_TRYKITT` par votre clé API Trykitt réelle. Vous pouvez également omettre le bloc `env` ici si vous avez défini la clé dans un fichier `.env` à la racine du projet `trykitt-mcp` lui-même, car le serveur la récupérera à partir de là. 