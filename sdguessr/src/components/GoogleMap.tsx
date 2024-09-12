'use client';

import React, { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog'; // Import shadcn Dialog

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

  // Create a new AdvancedMarkerElement
  const marker = new AdvancedMarkerElement({
    map: map, // Attach marker to map
    position: position, // Set position
  });

  // Info window content (e.g., your secret message)
  const infowindow = new google.maps.InfoWindow();
  const dialogDiv = document.getElementsByClassName('markerContainer');

  // Attach the event listener for click
  marker.addListener('click', () => {
      setIsDialogOpen(true);
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
            <Dialog.Content className="fixed top-[20%] left-1/2 transform -translate-x-1/2 rounded-lg bg-white p-8 shadow-lg max-w-md w-full">
              <Dialog.Title className="text-lg font-bold">Marker Information</Dialog.Title>
              <br></br>
              <Dialog.Description className="mt-2">
                <p>User: {user}</p>
                <br></br>
                <p>Summary: {assistant}</p>
              </Dialog.Description>
              <Dialog.Close asChild>
              <button className="px-6 py-2 bg-black hover:bg-blue-500 text-white text-lg rounded-full">Close</button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
    </div>

          {/* Dialog */}
      <div className="dialogContainer">
      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Trigger asChild>
          <button className="hidden">Open Dialog</button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50">
            <Dialog.Content className="fixed top-[20%] left-1/2 transform -translate-x-1/2 rounded-lg bg-white p-8 shadow-lg max-w-md w-full">
              <Dialog.Title className="text-lg font-bold">Marker Information</Dialog.Title>
              <br></br>
              <Dialog.Description className="mt-2">
                <p>User: I saw trash being placed onto the sidewalk near where I work.
                  The community of people here are not too happy about that.</p>
                <br></br>
                <p>Summary: The mining industry has led to significant environmental degradation in the local community,
                  primarily through pollution, habitat destruction, and improper waste management. The presence of mining
                  operations often results in contaminated water sources and air quality issues, which can adversely
                  affect public health. Additionally, the influx of workers can strain local resources and infrastructure,
                  causing tensions among residents. Increasing littering, such as trash on sidewalks, reflects a broader
                  issue of neglect and insufficient waste management linked to mining activities. To mitigate these impacts,
                  the community could advocate for stricter regulations on mining practices, implement better waste management
                  systems, and engage in community cleanup initiatives to foster a cleaner environment. Education campaigns
                  may also help residents understand the importance of maintaining their surroundings and the impact of mining operations.</p>
              </Dialog.Description>
              <Dialog.Close asChild>
              <button className="px-6 py-2 bg-black hover:bg-blue-500 text-white text-lg rounded-full">Close</button>
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
