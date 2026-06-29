export const getIpLocation = async (): Promise<[number, number] | null> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    if (data.latitude && data.longitude) {
      return [data.latitude, data.longitude];
    }
    return null;
  } catch (error) {
    console.error('IP Geolocation error:', error);
    return null;
  }
};

export const getUserLocation = (
  onSuccess: (coords: [number, number]) => void,
  onError?: (error: GeolocationPositionError | Error) => void
) => {
  if (!navigator.geolocation) {
    getIpLocation().then((coords) => {
      if (coords) onSuccess(coords);
      else if (onError) onError(new Error('Geolocation not supported and IP fallback failed'));
    });
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      onSuccess([pos.coords.latitude, pos.coords.longitude]);
    },
    (err) => {
      console.warn('Browser geolocation failed, trying IP fallback...', err);
      getIpLocation().then((coords) => {
        if (coords) onSuccess(coords);
        else if (onError) onError(err);
      });
    },
    { 
      enableHighAccuracy: true, 
      timeout: 5000, 
      maximumAge: 1000 * 60 * 5 // 5 minutes cache
    }
  );
};
