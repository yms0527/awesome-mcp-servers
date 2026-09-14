import requests
from dotenv import load_dotenv
import os

load_dotenv()

BASE_URL = os.getenv("POKE_API_URL")

class Pokemon:
    def __init__(self, name):
        self.name = name.lower()
        self.id = None
        self.moves = []
        self.abilities = []
        self.types = []
        self.height = None
        self.weight = None
        self.stats = {}
        self.sprite = None
        self.flavor_text = None
        self.evolution_chain = []

    def fetch_basic_info(self):
        url = f"{BASE_URL}/pokemon/{self.name}"
        response = requests.get(url)

        if response.status_code != 200:
            raise Exception(f"Failed to fetch Pokémon data: {response.status_code}")

        data = response.json()
        self.id = data.get("id")
        self.moves = [move["move"]["name"] for move in data["moves"][:5]]  # Limit to 5 for brevity
        self.abilities = [ability["ability"]["name"] for ability in data["abilities"]]
        self.types = [t["type"]["name"] for t in data["types"]]
        self.height = data.get("height")
        self.weight = data.get("weight")
        self.stats = {stat["stat"]["name"]: stat["base_stat"] for stat in data["stats"]}
        self.sprite = data["sprites"]["front_default"]

    def fetch_flavor_text(self):
        url = f"{BASE_URL}/pokemon-species/{self.name}"
        response = requests.get(url)

        if response.status_code != 200:
            raise Exception(f"Failed to fetch species data: {response.status_code}")

        data = response.json()
        flavor_entries = data.get("flavor_text_entries", [])
        for entry in flavor_entries:
            if entry["language"]["name"] == "en":
                self.flavor_text = entry["flavor_text"].replace('\n', ' ').replace('\f', ' ')
                break

        # Fetch evolution chain URL
        evolution_url = data["evolution_chain"]["url"]
        self.fetch_evolution_chain(evolution_url)

    def fetch_evolution_chain(self, url):
        response = requests.get(url)
        if response.status_code != 200:
            raise Exception("Failed to fetch evolution chain")

        chain_data = response.json()["chain"]
        self.evolution_chain = self._extract_evolutions(chain_data)

    def _extract_evolutions(self, chain):
        evolutions = []
        while chain:
            evolutions.append(chain["species"]["name"])
            chain = chain["evolves_to"][0] if chain["evolves_to"] else None
        return evolutions

    def get_summary(self):
        return {
            "name": self.name,
            "id": self.id,
            "types": self.types,
            "abilities": self.abilities,
            "height": self.height,
            "weight": self.weight,
            "stats": self.stats,
            "sprite": self.sprite,
            "flavor_text": self.flavor_text,
            "evolution_chain": self.evolution_chain,
            "moves": self.moves
        }
    def get_image_url(self):
       return self.sprite

# Example usage:
if __name__ == "__main__":
    pikachu = Pokemon("pikachu")
    pikachu.fetch_basic_info()
    pikachu.fetch_flavor_text()
    print(pikachu.get_summary())

# Key	                Type	               Description
# name	                string	               The name of the Pokémon (e.g., "pikachu").
# id	                int	                   The Pokédex ID (e.g., 25 for Pikachu).
# types	                list[string]	       List of type(s) the Pokémon belongs to (e.g., ["electric"]).
# abilities            	list[string]	       List of abilities (e.g., ["static", "lightning-rod"]).
# height	            int	                   Height of the Pokémon in decimetres.
# weight	            int	                   Weight of the Pokémon in hectograms.
# stats	dict	        Dictionary             of base stats (e.g., {"hp": 35, "attack": 55, "speed": 90, ...}).
# sprite	            string (URL)	       URL of the Pokémon's front-facing sprite image.
# flavor_text	        string                 A short lore/description from the species endpoint.
# evolution_chain	    list[string]           Pokémon in the evolution line (e.g., ["pichu", "pikachu", "raichu"]).
# moves              	list[string]	       First 5 moves the Pokémon can learn (e.g., ["thunder-shock", ...]).