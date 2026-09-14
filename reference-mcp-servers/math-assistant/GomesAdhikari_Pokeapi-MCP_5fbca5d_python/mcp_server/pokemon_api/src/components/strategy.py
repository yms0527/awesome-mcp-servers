import requests
from collections import defaultdict
from dotenv import load_dotenv
import os
load_dotenv()

POKEAPI_BASE = os.getenv("POKE_API_URL")

def get_pokemon_types(name):
    url = f"{POKEAPI_BASE}/pokemon/{name.lower()}"
    res = requests.get(url)
    if res.status_code != 200:
        raise ValueError("Pokémon not found in PokeAPI")
    data = res.json()
    return [t['type']['name'] for t in data['types']]

def get_type_weaknesses(pokemon_types):
    weaknesses = defaultdict(float)

    for p_type in pokemon_types:
        url = f"{POKEAPI_BASE}/type/{p_type}"
        res = requests.get(url)
        if res.status_code != 200:
            continue
        data = res.json()
        dmg_rel = data['damage_relations']

        for dt in dmg_rel['double_damage_from']:
            weaknesses[dt['name']] += 2
        for dt in dmg_rel['half_damage_from']:
            weaknesses[dt['name']] -= 1
        for dt in dmg_rel['no_damage_from']:
            weaknesses[dt['name']] -= 5

    # Filter out negative resistances
    return dict(sorted({k: v for k, v in weaknesses.items() if v > 0}.items(), key=lambda x: x[1], reverse=True))

def get_pokemon_by_type(poke_type, exclude_name=None, limit=100):
    url = f"{POKEAPI_BASE}/type/{poke_type}"
    res = requests.get(url)
    if res.status_code != 200:
        return []
    data = res.json()
    pokes = []
    for p in data['pokemon'][:limit]:
        name = p['pokemon']['name']
        if name.lower() != (exclude_name or "").lower():
            pokes.append(name)
    return pokes

def recommend_counters(pokemon_name, max_counters=5):
    try:
        types = get_pokemon_types(pokemon_name)
    except ValueError as e:
        return {"error": str(e)}

    weaknesses = get_type_weaknesses(types)

    # Get Pokémon that match the top 3 weakness types
    counter_pokemons = set()
    for counter_type in list(weaknesses.keys())[:3]:
        candidates = get_pokemon_by_type(counter_type, exclude_name=pokemon_name)
        counter_pokemons.update(candidates)
        if len(counter_pokemons) >= max_counters:
            break

    return {
        "pokemon": pokemon_name,
        "types": types,
        "top_weaknesses": weaknesses,
        "recommended_counters": list(counter_pokemons)[:max_counters]
    }
