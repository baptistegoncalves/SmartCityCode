from flask import Flask, jsonify
import requests

app = Flask(__name__)

# API pour récupérer les capteurs
SENSORS_API_URL = "https://data.grandlyon.com/fr/datapusher/ws/rdata/biotope.temperature_device/all.json?maxfeatures=-1&start=1"
# API pour récupérer les températures
TEMPERATURE_API_URL = "https://data.grandlyon.com/fr/datapusher/ws/timeseries/biotope.temperature/all.json"


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


# Fonction pour récupérer la température pour un capteur donné
def fetch_temperature(deveui, date):
    try:
        url = f"{TEMPERATURE_API_URL}?deveui={deveui}&date={date}"
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        if "values" in data and len(data["values"]) > 0:
            return data["values"][0]["degre_celsius"]
        return None
    except requests.RequestException as e:
        print(f"Erreur lors de la récupération des températures pour {deveui}: {e}")
        return None


# Fonction pour associer capteurs et températures
def get_sensors_with_temperature():
    capteurs = fetch_sensors()
    capteurs_with_temp = []

    for capteur in capteurs:
        temperature = fetch_temperature(capteur["deveui"], capteur["datemaj"])
        capteurs_with_temp.append(
            {
                "deveui": capteur["deveui"],
                "nom": capteur["nom"],
                "lat": capteur["lat"],
                "lon": capteur["lon"],
                "status": capteur["status"],
                "temperature": temperature,
                "datemaj": capteur["datemaj"],
            }
        )

    return capteurs_with_temp


# Route API pour renvoyer les capteurs avec les températures
@app.route("/api/capteurs", methods=["GET"])
def capteurs():
    data = get_sensors_with_temperature()
    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True)
