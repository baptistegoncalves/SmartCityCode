import React, { useState, useEffect } from 'react';
import MapScreen from '../components/MapScreen';
import benchesData from '../assets/json/Banc_lon_lat.json';
import noiseData from '../assets/json/Bruit_aerien_gid.json';
import parksData from '../assets/json/Parcs_places_jardins_gid.json';

const DataLoader = () => {
  const [benches, setBenches] = useState([]);
  const [parks, setParks] = useState([]);
  const [noiseZones, setNoiseZones] = useState([]);

  useEffect(() => {
    // Function to parse WKT POINT geometry
    const parseGeom = (geom) => {
      const match = geom.match(/POINT\s*\(\s*(\S+)\s+(\S+)\s*\)/);
      if (match) {
        const lon = parseFloat(match[1]);
        const lat = parseFloat(match[2]);
        return { lat, lon };
      } else {
        return { lat: null, lon: null };
      }
    };

    // Generic parseData function
    const parseData = (dataArray) => {
      return dataArray.map((item) => {
        const key = Object.keys(item)[0];
        const value = item[key];
        const fields = key.split(';');
        const values = value.split(';');
        const result = {};
        fields.forEach((field, index) => {
          result[field.trim()] = values[index].trim();
        });
        // If 'geom' field exists, parse it to get lat and lon
        if (result.geom) {
          const coords = parseGeom(result.geom);
          result.lat = coords.lat;
          result.lon = coords.lon;
        }
        return result;
      });
    };

    // Parse benches data
    const parsedBenches = parseData(benchesData);
    setBenches(parsedBenches);

    // Parse parks data
    const parsedParks = parseData(parksData);
    setParks(parsedParks);

    // Parse noise zones data
    const parsedNoiseZones = parseData(noiseData);
    setNoiseZones(parsedNoiseZones);
  }, []);

  return (
    <MapScreen benches={benches} parks={parks} noiseZones={noiseZones} />
  );
};

export default DataLoader;
