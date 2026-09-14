# Agent-Friendly Pokémon API

All endpoints accept and return JSON. All responses are standardized as:
- Success: `{ "result": ... }`
- Error: `{ "error": ... }`

---

## 1. Get Pokémon Info
- **Endpoint:** `api/agent/pokemon-info/`
- **Method:** POST
- **Request:**
```json
{ "name": "pikachu" }
```
- **Response:**
```json
{ "result": { /* Pokémon info */ } }
```

---

## 2. Compare Pokémon
- **Endpoint:** `api/agent/compare/`
- **Method:** POST
- **Request:**
```json
{ "pokemon1": "pikachu", "pokemon2": "bulbasaur" }
```
- **Response:**
```json
{ "result": { /* Comparison result */ } }
```

---

## 3. Get Strategy
- **Endpoint:** `api/agent/strategy/`
- **Method:** POST
- **Request:**
```json
{ "name": "charizard" }
```
- **Response:**
```json
{ "result": { /* Strategy info */ } }
```

---

## 4. Team Composition
- **Endpoint:** `api/agent/team/`
- **Method:** POST
- **Request:**
```json
{ "description": "balanced team" }
```
- **Response:**
```json
{ "result": { /* Team data */ } }
```

---

## Error Example
```json
{ "error": "Missing 'name'" }
``` 