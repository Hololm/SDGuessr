'use client';

import React, { useEffect } from 'react';

function GoogleMap() {
  useEffect(() => {
    const loadMapScript = () => {
      return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&callback=initMap&libraries=places&v=beta`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Google Maps script'));
        document.body.appendChild(script);
      });
    };

    // Define initMap function
    (window as any).initMap = async () => {

      const { Map } = await google.maps.importLibrary('maps') as google.maps.MapsLibrary;

      const map = new Map(document.getElementById('map') as HTMLElement, {
        center: { lat: 34.002866, lng: -111.782272 },
        zoom: 8,
        gestureHandling: 'greedy',
        mapId: '5ef5eba7b54980de',
      });

      // Marker Function
      const { AdvancedMarkerElement } = await google.maps.importLibrary('marker') as google.maps.MarkerLibrary;

      const marker = new AdvancedMarkerElement({
        map, // Attach marker to map
        position: { lat: 34.002866, lng: -111.782272 }, // Position the marker
      });

      // Add a click listener to the marker
      // @ts-ignore
      marker.addListener('click', ({ domEvent, latLng }) => {
        console.log('Marker clicked at:', latLng.toString());
        // Add more logic here if needed
      });

    };

    // Load the Google Maps script
    loadMapScript().catch(error => console.error(error));

    return () => {
      // Cleanup the script if necessary
      const scripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
      scripts.forEach(script => script.remove());
    };
  }, []);

  return (
    <div>
      <div id="map" style={{ height: '100vh', width: '100%', outline: 'none' }}></div>
    </div>
  );
}

export default GoogleMap;
