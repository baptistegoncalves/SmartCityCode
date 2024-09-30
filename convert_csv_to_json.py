import csv
import json
import os

# Spécifiez le chemin du fichier CSV d'entrée et le fichier JSON de sortie
csv_file_path = 'assets/datasets/Camera_Lyon_lon_lat.csv'  # Remplacez par votre chemin
json_file_path = 'assets/datasets/Camera_Lyon_lon_lat.json'  # Chemin du fichier JSON de sortie

def csv_to_json(csv_file_path, json_file_path):
    # Lire le fichier CSV et le convertir en JSON
    with open(csv_file_path, mode='r', encoding='utf-8') as csv_file:
        csv_reader = csv.DictReader(csv_file, delimiter=';')
        data = []

        for row in csv_reader:
            # Convertir lon et lat en float
            row['lon'] = float(row['lon'].replace(',', '.'))
            row['lat'] = float(row['lat'].replace(',', '.'))
            data.append(row)

    # Écrire les données JSON dans le fichier
    with open(json_file_path, mode='w', encoding='utf-8') as json_file:
        json.dump(data, json_file, ensure_ascii=False, indent=4)

    print(f'Conversion réussie : {csv_file_path} -> {json_file_path}')

# Appeler la fonction de conversion
csv_to_json(csv_file_path, json_file_path)
