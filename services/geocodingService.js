import axios from "axios";

export async function getCoordinates(address) {
  const API_KEY = process.env.API_KEY;
  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
    address
  )}&apiKey=${API_KEY}`;

  try {
    console.log(process.env.API_KEY);
    const response = await axios.get(url);
    if (response.data.features && response.data.features.length > 0) {
      const location = response.data.features[0].geometry.coordinates;
      return {
        latitude: location[1],
        longitude: location[0],
      };
    } else {
      throw new Error("Unable to fetch coordinates");
    }
  } catch (error) {
    throw new Error(`Geocoding API error: ${error.message}`);
  }
}
