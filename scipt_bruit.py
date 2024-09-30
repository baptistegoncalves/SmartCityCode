import json
import random

# Charger le fichier JSON
with open('assets/datasets/bruit.mesures_observatoire_acoustique.json', 'r') as file:
    data = json.load(file)

# Définir les limites géographiques pour Lyon
lat_min, lat_max = 45.70, 45.83
lon_min, lon_max = 4.78, 4.95

# Fonction pour générer des coordonnées aléatoires
def generate_random_coordinates():
    latitude = random.uniform(lat_min, lat_max)
    longitude = random.uniform(lon_min, lon_max)
    return latitude, longitude

# Utiliser un ensemble pour suivre les coordonnées déjà utilisées
used_coordinates = set()

for entry in data['values']:
    while True:
        lat, lon = generate_random_coordinates()
        if (lat, lon) not in used_coordinates:
            used_coordinates.add((lat, lon))
            entry['latitude'] = lat
            entry['longitude'] = lon
            break

# Sauvegarder le fichier JSON mis à jour
with open('assets/datasets/bruit.mesures_observatoire_acoustique.json', 'w') as file:
    json.dump(data, file, indent=4)