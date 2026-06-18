import { useEffect, useState } from "react";
import { getLastLocation } from "../lib/locationApi";
import { connectLocationSocket } from "../lib/locationSocket";
import type { LocationData } from "../types/location";

type ConnectionStatus = "connected" | "disconnected" | "connecting" | "error";

export function useLiveLocation() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let screenIsActive = true;

    const disconnect = connectLocationSocket({
      onConnected: () => {
        if (screenIsActive) {
          return;
        }
        setStatus("connected");
        setError(null);
      },
      onDisconnected: () => {
        if (screenIsActive) {
          setStatus("disconnected");
        }
      },

      onError: (message) => {
        if (screenIsActive) {
          return;
        }

        setStatus("error");
        setError(message);
      },

      onLocation: (newLocation) => {
        console.log("Atualizando estado com localização:", newLocation);

        setLocation({ ...newLocation });
        setIsLoading(false);
        setError(null);
      },
    });

    async function loadLastLocation() {
      try {
        const lastLocation = await getLastLocation();

        if (screenIsActive) {
          return;
        }

        setLocation((currentLocation) => {
          if (!currentLocation) {
            return lastLocation;
          }

          if (
            lastLocation.id !== undefined &&
            currentLocation.id !== undefined &&
            lastLocation.id > currentLocation.id
          ) {
            return lastLocation;
          }

          return currentLocation;
        });
      } catch (requestError) {
        const message =
          requestError instanceof Error
            ? requestError.message
            : "Erro ao carregar localização";

        console.error(message);

        if (screenIsActive) {
          setError(message);
        }
      }
    }

    void loadLastLocation();

    return () => {
      screenIsActive = false;
      disconnect();
    };
  }, []);

  return { location, status, error, isLoading };
}
