import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import {
  DirectionsRenderer,
  DirectionsService,
  Marker,
  OverlayView,
} from "@react-google-maps/api";
import React, { useEffect } from "react";

function Place(place) {
  const [open, setOpen] = React.useState(false);
  if (!place.coordinates) {
    return <></>;
  }
  return (
    <>
      <Marker
        key={place.place}
        position={place.coordinates}
        onClick={(e) => {
          const directionsService = new window.google.maps.DirectionsService();
          navigator.geolocation.getCurrentPosition((position) => {
            const origin = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            const destination = {
              lat: place.coordinates.lat,
              lng: place.coordinates.lng,
            };

            directionsService.route(
              {
                origin: origin,
                destination: destination,
                travelMode: window.google.maps.TravelMode.DRIVING,
              },
              (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                  place.setDirections(result);
                } else {
                  console.error(`error fetching directions ${result}`);
                }
              }
            );
          });

          setOpen(!open);
        }}
      />
      <OverlayView
        position={place.coordinates}
        mapPaneName={OverlayView.MAP_PANE}
      >
        <Box
          sx={{
            backgroundColor: "white",
            padding: 1,
            borderRadius: 1,
            boxShadow: 1,
            display: open ? "block" : "none",
            transform: "translate(-50%, -200%)",
          }}
        >
          <Typography variant="h6">{place.place}</Typography>
          <Typography variant="body2">
            Tiket Masuk : Rp. {new Intl.NumberFormat().format(place.price)}
          </Typography>
          <button onClick={() => {
            console.log(place);
            setOpen(!open);
          }}>Close</button>
        </Box>
      </OverlayView>
    </>
  );
}

export default function LocationPlace({ setDirections }) {
  const [listPlace, setListPlace] = React.useState([]);

  useEffect(() => {
    fetch("https://plankton-app-l385o.ondigitalocean.app/place")
      .then((res) => res.json())
      .then((data) => {
        setListPlace(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  console.log(listPlace);

  return (
    <>
      {listPlace.map((place) => {
        return (
          <Place key={place.place} {...place} setDirections={setDirections} />
        );
      })}
    </>
  );
}
