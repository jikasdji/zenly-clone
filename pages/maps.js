import { Avatar, Box } from "@mui/material";
import {
  DirectionsRenderer,
  GoogleMap,
  OverlayView,
  useJsApiLoader,
} from "@react-google-maps/api";
import React, { useEffect, useRef } from "react";
import AvatarComponent from "../components/Avatar";
import { useAuth } from "../hooks/useAuth";
import AvatarLocation from "../components/AvatarLocation";
import LocationPlace from "../components/LocationPlace";

function MapsWrapper() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyA5v1V6NQp55zEAWOrDZwzjgoa-pIjZD5U",
  });
  const [currentPosition, setCurrentPosition] = React.useState({
    lat: -7.797068,
    lng: 110.370529,
  });

  const [directions, setDirections] = React.useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }, []);

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={{
        height: "100vh",
        width: "100vw",
      }}
      center={currentPosition}
      zoom={13}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      <AvatarLocation setDirections={setDirections} />
      <LocationPlace setDirections={setDirections} />
      {directions && (
        <DirectionsRenderer directions={directions} options={{}} />
      )}
    </GoogleMap>
  ) : (
    <></>
  );
}

export default React.memo(MapsWrapper);
