import csv
import json

def csv_to_json(csv_file_path, json_file_path):
    data = []

    with open(csv_file_path, mode='r', encoding='utf-8') as csv_file:
        csv_reader = csv.DictReader(csv_file, delimiter=';')
        for row in csv_reader:
            data.append(row)

    with open(json_file_path, mode='w', encoding='utf-8') as json_file:
        json.dump(data, json_file, indent=4, ensure_ascii=False)

csv_file_path = './assets/datasets/Banc_lon_lat.csv'

json_file_path = './assets/datasets/Banc_lon_lat.json'

csv_to_json(csv_file_path, json_file_path)