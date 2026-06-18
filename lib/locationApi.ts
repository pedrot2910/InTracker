import type { LocationData } from "../types/location";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function getLastLocation(): Promise<LocationData> {
  if (!API_URL) {
    throw new Error("API URL não foi configurado");
  }

  const response = await fetch(`${API_URL}/api/v1/locations/last`);

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Erro ao obter última localização: ${response.status} ${body}`,
    );
  }

  return response.json();
}
