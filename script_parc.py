import csv
import json
import os

def csv_to_json(csv_file_path, json_file_path):
    data = []

    # Lire le fichier CSV
    with open(csv_file_path, mode='r', encoding='utf-8') as csv_file:
        csv_reader = csv.DictReader(csv_file, delimiter=';')
        for row in csv_reader:
            data.append(row)

    # Vérifie que le répertoire existe, sinon le créer
    os.makedirs(os.path.dirname(json_file_path), exist_ok=True)

    # Écrire les données JSON dans un fichier
    with open(json_file_path, mode='w', encoding='utf-8') as json_file:
        json.dump(data, json_file, indent=4, ensure_ascii=False)

# Chemin du fichier CSV
csv_file_path = './assets/datasets/Parcs_places_jardins_gid.csv'  # Remplace par le chemin de ton fichier CSV

# Chemin du fichier JSON de sortie
json_file_path = './assets/datasets/parcs_places_jardins.json'  # Assure-toi d'inclure le nom du fichier JSON

# Convertir le CSV en JSON
csv_to_json(csv_file_path, json_file_path)