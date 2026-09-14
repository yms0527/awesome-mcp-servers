import requests

class PokemonComparer:
    def __init__(self, name1, name2):
        self.name1 = name1.lower()
        self.name2 = name2.lower()
        self.pokemon_data = {}

    def fetch_data(self, name):
        url = f"https://pokeapi.co/api/v2/pokemon/{name}"
        response = requests.get(url)
        if response.status_code != 200:
            raise Exception(f"Pokémon '{name}' not found")
        return response.json()

    def extract_info(self, data):
        stats = {s['stat']['name']: s['base_stat'] for s in data['stats']}
        types = [t['type']['name'] for t in data['types']]
        abilities = [a['ability']['name'] for a in data['abilities']]
        return {
            "stats": stats,
            "types": types,
            "abilities": abilities,
        }

    def compare(self):
        data1 = self.extract_info(self.fetch_data(self.name1))
        data2 = self.extract_info(self.fetch_data(self.name2))

        comparison = {
            "pokemon_1": self.name1,
            "pokemon_2": self.name2,
            "stats_comparison": {},
            "type_advantage": self.compare_types(data1["types"], data2["types"]),
            "shared_abilities": list(set(data1["abilities"]) & set(data2["abilities"])),
            "unique_abilities": {
                self.name1: list(set(data1["abilities"]) - set(data2["abilities"])),
                self.name2: list(set(data2["abilities"]) - set(data1["abilities"])),
            }
        }

        for stat in data1["stats"]:
            stat1 = data1["stats"][stat]
            stat2 = data2["stats"][stat]
            winner = self.name1 if stat1 > stat2 else self.name2 if stat2 > stat1 else "Tie"
            comparison["stats_comparison"][stat] = {
                self.name1: stat1,
                self.name2: stat2,
                "winner": winner
            }

        return comparison

    def compare_types(self, types1, types2):
        # Basic logic: if same type, it's a tie
        if set(types1) == set(types2):
            return "Same Types"
        return {
            self.name1: types1,
            self.name2: types2
        }
