'use client';

import React, { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog'; // Import shadcn Dialog
import { Button } from "@/components/ui/button";

function GoogleMap() {
  const [user, setUser] = useState("Loading...");
  const [assistant, setAssistant] = useState("Loading...");
  const [mapInstance, setMap] = useState<google.maps.Map | null>(null);
  const [clickedMarkerData, setClickedMarkerData] = useState({ lat: 0, lng: 0 }); // Track clicked marker's data
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Track if dialog is open
  const [isDataFetched, setIsDataFetched] = useState(false); // New state to track if data is already fetched

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

    // Fetch data from Flask
    fetch("http://localhost:8080/api/home")
      .then(response => response.json())
      .then(data => {
        setUser(data.user);
        setAssistant(data.assistant);
        setIsDataFetched(true); // Mark data as fetched to prevent duplicate fetch
      })
      .catch(error => console.error("Error fetching data:", error));

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
      async function addMarker(position: google.maps.LatLng | google.maps.LatLngLiteral) {
  if (!map) return;

  const { AdvancedMarkerElement } = await google.maps.importLibrary('marker') as google.maps.MarkerLibrary;

   const marker1 = new AdvancedMarkerElement({
      map: mapInstance,
      position: { lat: 37.4239163, lng: -122.0947209 },
  });

  const marker = new AdvancedMarkerElement({
    map: map, // Attach marker to map
    position: position, // Set position
  });

  // Create a new AdvancedMarkerElement
  const marker2 = new AdvancedMarkerElement({
    map, // Attach marker to map
    position: {lat: 33.423545, lng: -111.932736}, // Set position
  });

  // Info window content (e.g., your secret message)
  const infowindow = new google.maps.InfoWindow();
  const dialogDiv = document.getElementsByClassName('markerContainer');

  // Attach the event listener for click
  marker.addListener('click', () => {
      setIsDialogOpen(true);
  });
}};

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
  }, [mapInstance]); // Run when `message` or `map` changes

  function attachUserMessage(
    marker: google.maps.Marker,
    userMessage: string
  ) {
    /* const infowindow = new google.maps.InfoWindow({
      content: userMessage,
    }); */

    marker.addListener("click", () => {
      /* setClickedMarkerData({lat: position.lat, lng: position.lng }); */
      setIsDialogOpen(true);
    });
  }

  return (
    <div>
      <div id="map" style={{ height: '100vh', width: '100%', outline: 'none' }}></div>



    {/* Dialog */}
      <div className="dialogContainer">
      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Trigger asChild>
          <button className="hidden">Open Dialog</button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50">
            <Dialog.Content
                className="fixed top-[20%] left-1/2 transform -translate-x-1/2 rounded-lg bg-white p-8 shadow-lg max-w-md w-full">

               {/* SVG Icon in the top-right */}
            <img src="https://sdgimpact.asu.edu/sites/default/files/2022-10/e_sdg_icons-01.png"
                 className="absolute top-3 right-3 h-16 w-16 rounded-full border-2 border-black bg-white">
            </img>
              <Dialog.Title className="text-lg font-bold">Marker Information</Dialog.Title>
              <br></br>
              <Dialog.Description className="mt-2">
                <Dialog.Title className="text-base font-bold">User</Dialog.Title>
                <br></br>
                <p>{user}</p>
                <br></br>
                <Dialog.Title className="text-base font-bold">AI Summary</Dialog.Title>
              <br></br>
                <p>{assistant}</p>
              </Dialog.Description>
              <br></br>
              <Dialog.Close asChild>
                <button
                    className="dialogContainer px-6 py-2 bg-black hover:bg-blue-500 text-white text-lg rounded-full">Close
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
    </div>


  );
}

export default GoogleMap;
