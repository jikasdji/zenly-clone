import { Avatar, Box, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { OverlayView } from "@react-google-maps/api";
import React from "react";

export default function AvatarComponent({
  position,
  user,
  address,
  isOnline,
  setDirections,
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <OverlayView
      position={position}
      mapPaneName="floatPane"
      style={{ position: "absolute" }}
    >
      <Box
        sx={{
          width: "50px",
          height: "50px",
          borderRadius: "10px",
          position: "relative",
          transform: "translate(-50%, -125%)",
        }}
      >
        <Box
          sx={{
            width: "50px",
            height: "50px",
            borderRadius: "10px",
            backgroundColor: isOnline ? "#ADE792" : "#E7E7E7",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => {
            setOpen(!open);
            navigator.geolocation.getCurrentPosition((positionUser) => {
              const origin = {
                lat: positionUser.coords.latitude,
                lng: positionUser.coords.longitude,
              };

              const destination = position;

              const directionsService =
                new window.google.maps.DirectionsService();
              directionsService.route(
                {
                  origin: origin,
                  destination: destination,
                  travelMode: window.google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                  if (status === window.google.maps.DirectionsStatus.OK) {
                    setDirections(result);
                  }
                }
              );
            });
          }}
        >
          <Avatar alt={user.username} src={user.image} />
          <Box
            sx={{
              width: 0,
              height: 0,
              borderTop: "10px solid transparent",
              borderBottom: "10px solid transparent",
              borderLeft: `10px solid ${isOnline ? "#ADE792" : "#E7E7E7"}`,
              position: "absolute",
              left: "20%",
              top: "90%",
              transform: "translateY(-50%)",
              rotate: "90deg",
            }}
          />
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: "-100%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "200px",
            backgroundColor: "#3C6255",
            padding: "10px",
            color: "white",
            borderRadius: "10px",
            display: open ? "block" : "none",
            zIndex: 1,
          }}
        >
          <Typography variant="body1">{user.username}</Typography>
          <Typography variant="body3">{address}</Typography>
        </Box>
      </Box>
    </OverlayView>
  );
}
