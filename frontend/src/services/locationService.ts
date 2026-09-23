export type LatLng = {
  lat: number;
  lng: number;
};

export type LocationResult = {
  lat: number;
  lng: number;
  address: string;
  formattedAddress?: string;
  components?: {
    street?: string;
    city?: string;
    area?: string;
    country?: string;
    postalCode?: string;
  };
};

export const locationService = {
  async getCurrentLocation(): Promise<LatLng> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          let message = "Unable to retrieve location.";
          if (error.code === 1) message = "Location permission denied. Please enable location access.";
          if (error.code === 2) message = "Location unavailable. Please try again.";
          if (error.code === 3) message = "Location request timed out. Please try again.";
          reject(new Error(message));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    });
  },

  async reverseGeocode(lat: number, lng: number): Promise<string> {
    const coordinateFallback = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

    try {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

      if (apiKey) {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
        );
        const data = await response.json();

        if (data.status === "OK" && data.results?.[0]) {
          return data.results[0].formatted_address;
        }
      }
    } catch {
      // Fall through to the public fallback below.
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=en`
      );
      const data = await response.json();

      if (data.display_name) {
        return data.display_name;
      }
    } catch {
      // Coordinates are still useful when no reverse-geocoder is available.
    }

    return coordinateFallback;
  },

  async geocodeAddress(address: string): Promise<LatLng | null> {
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
      );
      const data = await response.json();

      if (data.status === "OK" && data.results?.[0]?.geometry?.location) {
        return {
          lat: data.results[0].geometry.location.lat,
          lng: data.results[0].geometry.location.lng,
        };
      }

      return null;
    } catch {
      return null;
    }
  },

  async searchPlaces(query: string): Promise<Array<{ name: string; address: string; lat: number; lng: number }>> {
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${apiKey}&components=country:bd`
      );
      const data = await response.json();

      if (data.status === "OK" && data.predictions) {
        const places = await Promise.all(
          data.predictions.slice(0, 5).map(async (prediction: any) => {
            const detailResponse = await fetch(
              `https://maps.googleapis.com/maps/api/place/details/json?place_id=${prediction.place_id}&fields=geometry,name,formatted_address&key=${apiKey}`
            );
            const detailData = await detailResponse.json();

            if (detailData.status === "OK" && detailData.result?.geometry?.location) {
              return {
                name: prediction.structured_formatting?.main_text || prediction.description,
                address: prediction.structured_formatting?.secondary_text || prediction.description,
                lat: detailData.result.geometry.location.lat,
                lng: detailData.result.geometry.location.lng,
              };
            }

            return null;
          })
        );

        return places.filter((place): place is { name: string; address: string; lat: number; lng: number } => place !== null);
      }

      return [];
    } catch {
      return [];
    }
  },
};
