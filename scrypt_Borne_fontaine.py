import csv
import json
import os

def read_csv(file_path, delimiter=';'):
    data = []
    with open(file_path, mode='r', encoding='utf-8') as csv_file:
        csv_reader = csv.DictReader(csv_file, delimiter=delimiter)
        for row in csv_reader:
            data.append(row)
    return data

def remove_column(data, column_name):
    for row in data:
        if column_name in row:
            del row[column_name]
    return data

def merge_data(data1, data2):
    return data1 + data2

def write_json(data, json_file_path):
    os.makedirs(os.path.dirname(json_file_path), exist_ok=True)
    with open(json_file_path, mode='w', encoding='utf-8') as json_file:
        json.dump(data, json_file, indent=4, ensure_ascii=False)

# Chemins des fichiers CSV
csv_file_path_1 = './assets/datasets/Borne_fontaine_2_lon_lat.csv'
csv_file_path_2 = './assets/datasets/Borne_fontaine_lon_lat.csv'

# Chemin du fichier JSON de sortie
json_file_path = './assets/datasets/Borne_fontaine.json'

# Lire les fichiers CSV
data1 = read_csv(csv_file_path_1)
data2 = read_csv(csv_file_path_2)

# Supprimer la colonne 'identifiantbornefontaine' du premier fichier CSV
data1 = remove_column(data1, 'identifiantbornefontaine')

# Fusionner les données des deux fichiers CSV
merged_data = merge_data(data1, data2)

# Écrire les données fusionnées en JSON
write_json(merged_data, json_file_path)