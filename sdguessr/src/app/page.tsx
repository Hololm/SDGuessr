import React from 'react';
import GoogleMap from '@/components/GoogleMap';
import './globals.css'; // Import the global styles
import NavBar from '@/components/NavBar';

const Page: React.FC = () => {

  return (
      <div>
          <div className="markerContainer">
          <div className="navBar">
              <NavBar/>
          </div>
          <div className="mapContainer">
          <GoogleMap/>
          </div>
          </div>
      </div>
  );
};

export default Page;