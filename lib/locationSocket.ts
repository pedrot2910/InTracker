import { Client, type IMessage } from "@stomp/stompjs";
import "text-encoding";
import { LocationData } from "../types/location";

const WS_URL = process.env.EXPO_PUBLIC_WS_URL;

interface locationSocketCallbacks {
  onLocation: (location: LocationData) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
  onError?: (message: string) => void;
}

export function connectLocationSocket({
  onLocation,
  onConnected,
  onDisconnected,
  onError,
}: locationSocketCallbacks): () => void {
  if (!WS_URL) {
    throw new Error("WebSocket URL não foi configurado");
  }

  const client = new Client({
    brokerURL: WS_URL,
    reconnectDelay: 5000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,

    forceBinaryWSFrames: true,
    appendMissingNULLonIncoming: true,

    debug: (message) => {
      if (__DEV__) {
        console.log("STOMP:", message);
      }
    },
  });

  client.onConnect = () => {
    console.log("STOMP conectado");

    onConnected?.();

    client.subscribe("/topic/location", (message: IMessage) => {
      try {
        const location = JSON.parse(message.body) as LocationData;
        console.log("Localização recebida:", location);
        onLocation(location);
      } catch (error) {
        console.error("Erro ao interpretar a localização:", error);
        onError?.("O backend enviou uma localização inválida");
      }
    });
  };

  client.onWebSocketClose = () => {
    console.log("WebSocket desconectado");
    onDisconnected?.();
  };

  client.onWebSocketError = (error) => {
    console.log("Erro no WebSocket:", error);
    onError?.("Erro de conexão com o WebSocket.");
  };

  client.onStompError = (frame) => {
    const message = frame.headers.message ?? "Erro desconhecido no STOMP";

    console.error("Erro no STOMP:", message);
    console.error(frame.body);

    onError?.(message);
  };

  client.activate();

  return () => {
    void client.deactivate();
  };
}
