import requests
import json
import os
from geopy.distance import geodesic

# API pour récupérer les capteurs
SENSORS_API_URL = "https://data.grandlyon.com/fr/datapusher/ws/rdata/biotope.temperature_device/all.json?maxfeatures=-1&start=1"
# API pour récupérer les températures
TEMPERATURE_API_URL = "https://data.grandlyon.com/fr/datapusher/ws/timeseries/biotope.temperature/all.json"

# Liste des deveui à ignorer
IGNORE_DEVEUI = [
    "70b3d580a01005fd", "70b3d580a01005fa",
    "70b3d580a0100605", "70b3d580a0100600",
    "70b3d580a010054c", "70b3d580a0100549"
]

# Fonction pour récupérer les capteurs
def fetch_sensors():
    try:
        response = requests.get(SENSORS_API_URL)
        response.raise_for_status()
        data = response.json()
        return data["values"]
    except requests.RequestException as e:
        print(f"Erreur lors de la récupération des capteurs: {e}")
        return []

# Fonction pour récupérer la température la plus récente pour un capteur donné
def fetch_latest_temperature(deveui):
    try:
        url = f"{TEMPERATURE_API_URL}?deveui={deveui}&order_by=desc&maxfeatures=1"
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        if "values" in data and len(data["values"]) > 0:
            temperature = data["values"][0].get("degre_celsius")
            datemaj = data["values"][0].get("datemaj", "N/A")  # Utiliser une valeur par défaut si 'datemaj' n'est pas présent
            return temperature, datemaj
        return None, None
    except requests.RequestException as e:
        print(f"Erreur lors de la récupération des températures pour {deveui}: {e}")
        return None, None

# Fonction pour associer capteurs et températures les plus récentes
def get_sensors_with_latest_temperature():
    capteurs = fetch_sensors()
    capteurs_with_temp = []

    for capteur in capteurs:
        if capteur["deveui"] in IGNORE_DEVEUI:
            continue  # Ignorer les capteurs avec deveui spécifiques
        temperature, datemaj = fetch_latest_temperature(capteur["deveui"])
        capteurs_with_temp.append(
            {
                "deveui": capteur["deveui"],
                "nom": capteur["nom"],
                "lat": capteur["lat"],
                "lon": capteur["lon"],
                "status": capteur["status"],
                "temperature": temperature,
                "datemaj": datemaj,
            }
        )
    return capteurs_with_temp

# Fonction pour filtrer les capteurs proches afin de supprimer les doublons
def filter_duplicate_sensors(capteurs, distance_threshold=50):
    unique_capteurs = []
    for capteur in capteurs:
        is_duplicate = False
        for unique_capteur in unique_capteurs:
            distance = geodesic(
                (capteur["lat"], capteur["lon"]),
                (unique_capteur["lat"], unique_capteur["lon"])
            ).meters
            if distance < distance_threshold:
                is_duplicate = True
                break
        if not is_duplicate:
            unique_capteurs.append(capteur)
    return unique_capteurs

# Fonction pour sauvegarder les données dans un fichier JSON
def save_data_to_json(data, filename="capteurs_data.json"):
    try:
        with open(filename, 'w', encoding='utf-8') as json_file:
            json.dump(data, json_file, ensure_ascii=False, indent=4)
        print(f"Données enregistrées dans {filename}")
    except IOError as e:
        print(f"Erreur lors de l'écriture des données dans le fichier JSON: {e}")

# Fonction principale pour récupérer et sauvegarder les données des capteurs
def main():
    # Supprimer le fichier JSON s'il existe déjà
    filename = "capteurs_data.json"
    if os.path.exists(filename):
        os.remove(filename)

    # Récupération des données des capteurs avec les températures les plus récentes
    capteurs_data = get_sensors_with_latest_temperature()

    # Filtrer les capteurs pour supprimer les doublons (capteurs trop proches)
    filtered_capteurs_data = filter_duplicate_sensors(capteurs_data)

    # Sauvegarder les données filtrées dans un fichier JSON
    save_data_to_json(filtered_capteurs_data)

if __name__ == "__main__":
    main()
