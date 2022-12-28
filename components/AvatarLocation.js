import React, { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import AvatarComponent from "./Avatar";
import io from "socket.io-client";

const socket = io("https://plankton-app-l385o.ondigitalocean.app", {
  transports: ["websocket"],
});
export default function AvatarLocation({ setDirections }) {
  const { user } = useAuth();
  const [clientPosition, setClientPosition] = React.useState(null);
  const [allLocations, setAllLocations] = React.useState([]);
  useEffect(() => {
    socketInitializer();
    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition((position) => {
        socket.emit("sendLocation", {
          id: user.id,
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          user: user,
        });
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [user]);

  const socketInitializer = async () => {
    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
    });

    socket.on("ping", () => {
      console.log("ping");
    });

    socket.on("allLocations", (data) => {
      console.log(data);
      setAllLocations(data);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("ping");
      socket.off("allLocations");
    };
  };

  return (
    <>
      {allLocations.map((location) => {
        if (!location.coordinates) return null;

        return (
          <AvatarComponent
            key={location.id}
            position={{
              lat: location.coordinates.latitude,
              lng: location.coordinates.longitude,
            }}
            user={location.user}
            isOnline={location.status === "online"}
            address={location.address}
            setDirections={setDirections}
          />
        );
      })}
    </>
  );
}
