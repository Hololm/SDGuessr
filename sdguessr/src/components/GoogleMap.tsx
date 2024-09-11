'use client';

import React, { useEffect, useState } from 'react';

function GoogleMap() {
  const [user, setUser] = useState("Loading");
  const [assistant, setAssistant] = useState("Loading");
  const [mapInstance, setMap] = useState<google.maps.Map | null>(null);

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

    // User fetch
    fetch("http://localhost:8080/api/home")
        .then(response => response.json())
        .then(data => {
          setUser(data.user);
        });

    // Assistant fetch
    fetch("http://localhost:8080/api/home")
        .then(response => response.json())
        .then(data => {
          setAssistant(data.assistant);
        });


    // Define initMap function
    (window as any).initMap = async () => {

      const { Map } = await google.maps.importLibrary('maps') as google.maps.MapsLibrary;

      const map = new Map(document.getElementById('map') as HTMLElement, {
        center: { lat: 34.002866, lng: -111.782272 },
        zoom: 7,
        rotateControl: false,
        streetViewControl: false,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          mapTypeIds: ["roadmap", "satellite", "hybrid"],
        },
        gestureHandling: 'greedy',
        mapId: '5ef5eba7b54980de',

        restriction: {
          latLngBounds:
              {north: 50.35, south: 20.89, west: -125, east: -71.76,},
          strictBounds: false,
          },
      });

      setMap(map);


      // Marker Function
      const { AdvancedMarkerElement } = await google.maps.importLibrary('marker') as google.maps.MarkerLibrary;

      function addMarker(position: google.maps.LatLng | google.maps.LatLngLiteral) {
        if (!map) return;
        const marker = new google.maps.Marker({
          position,
          map: map,
        });

            marker.addListener("click", () => {
              infowindow.open(marker.map, marker);
            });
          }

    };

    // Load the Google Maps script
    loadMapScript().catch(error => console.error(error));

    return () => {
      // Cleanup the script if necessary
      const scripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
      scripts.forEach(script => script.remove());
    };
  }, []);

  useEffect(() => {
    if (mapInstance && user !== "Loading") {
      // Reinitialize map markers when the message changes

      function addMarker(position: google.maps.LatLng | google.maps.LatLngLiteral) {
        const marker = new google.maps.Marker({
          position,
          map: mapInstance,
        });

        const userMessage = user;
        const assistantMessage = assistant;
        attachUserMessage(marker, userMessage);
      }

      mapInstance.addListener("click", (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          addMarker(event.latLng);
        }
      });
    }
  }, [user, mapInstance]); // Run when `message` or `map` changes

  function attachUserMessage(
    marker: google.maps.Marker,
    userMessage: string
  ) {
    const infowindow = new google.maps.InfoWindow({
      content: userMessage,
    });

    marker.addListener("click", () => {
      infowindow.open(marker.getMap(), marker);
    });
  }

  return (
    <div>
      <div id="map" style={{ height: '100vh', width: '100%', outline: 'none' }}></div>
    </div>
  );
}

export default GoogleMap;
