import React, { memo, useState } from "react";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";

const Map: React.FC<{ longitude: number; latitude: number }> = memo(
  ({ longitude, latitude }) => {
    const [showMarker, setShowMarker] = useState(false);
    const { isLoaded } = useJsApiLoader({
      id: "google-map-script",
      googleMapsApiKey: process?.env?.NEXT_PUBLIC_GOOGLE_MAP_KEY || ""
    });
    const position = {
      lat: latitude || 0,
      lng: longitude || 0
    };
    return (
      <>
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={{
              width: "100%",
              height: "500px",
              borderRadius: "10px",
              background: "#f6f6f6"
            }}
            center={position}
            onLoad={() => {
              setShowMarker(true);
            }}
            zoom={10}
          >
            {showMarker && <MarkerF position={position} />}
          </GoogleMap>
        )}
        {!isLoaded && (
          <div className="w-full h-[500px] bg-slate-200 animate-pulse rounded-md" />
        )}
      </>
    );
  }
);
Map.displayName = "Map";

export default Map;
