import pandas as pd


def remove_columns_from_csv(input_file, output_file, columns_to_remove):
    try:
        df = pd.read_csv(input_file, sep=";", on_bad_lines="skip")
        columns_to_remove = [col for col in columns_to_remove if col in df.columns]
        cleaned_df = df.drop(columns=columns_to_remove)
        cleaned_df.to_csv(output_file, sep=";", index=False)
        print(f"Fichier nettoyé sauvegardé : {output_file}")
    except Exception as e:
        print(f"Erreur lors du nettoyage du fichier {input_file}: {e}")


input_file = "./assets/datasets/biotope.temperature_device.csv"
output_file = "./assets/datasets/Capteurs_temperatures_lon_lat.csv"
columns_to_remove = ["nom","address","insee","status","battery_level"]

remove_columns_from_csv(input_file, output_file, columns_to_remove)