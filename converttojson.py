import pandas as pd

# Define the corrected file paths
file_paths = [
    "./assets/datasets/Parcs_places_jardins_gid.csv"
]

# Function to convert a CSV file to JSON
def csv_to_json(csv_file):
    try:
        # Use the 'python' engine for more flexible parsing and skip bad lines
        df = pd.read_csv(csv_file, engine='python', on_bad_lines='skip')
        # Convert to JSON
        json_data = df.to_json(orient='records', lines=False)
        # Define the output JSON file path
        json_file = csv_file.replace('.csv', '.json')
        # Save the JSON data to a file
        with open(json_file, 'w', encoding='utf-8') as f:
            f.write(json_data)
        print(f"Converted {csv_file} to {json_file}")
    except Exception as e:
        print(f"Failed to convert {csv_file}: {e}")

# Convert each CSV file
for file_path in file_paths:
    csv_to_json(file_path)
