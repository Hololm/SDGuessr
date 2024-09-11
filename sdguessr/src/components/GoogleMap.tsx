'use client';

import React, { useEffect, useState } from 'react';

function GoogleMap() {
  const [message, setMessage] = useState("Loading");

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

    fetch("http://localhost:8080/api/home")
        .then(response => response.json())
        .then(data => {
          setMessage(data.message);
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


      // Marker Function
      const { AdvancedMarkerElement } = await google.maps.importLibrary('marker') as google.maps.MarkerLibrary;

          const secretMessages = ["donovan", "is", "the", "secret", "message"];
          function attachSecretMessage(
              marker: google.maps.marker.AdvancedMarkerElement,
              secretMessage: string
          ) {
            const infowindow = new google.maps.InfoWindow({
              content: secretMessage,
            });

            marker.addListener("click", () => {
              infowindow.open(marker.map, marker);
            });
          }

      let markers: google.maps.Marker[] = [];
      map.addListener("click", (event: google.maps.MapMouseEvent) => {
      addMarker(event.latLng!);
       });

      function addMarker(position: google.maps.LatLng | google.maps.LatLngLiteral) {
        const marker = new google.maps.Marker({
          position,
          map,
        });
        attachSecretMessage(marker, secretMessages[0]);
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

  return (
      <div>
        <div>{message}</div>
        <div id="map" style={{height: '100vh', width: '100%', outline: 'none'}}></div>
      </div>
  );
}

export default GoogleMap;
