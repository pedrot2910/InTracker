export interface LocationData {
  id?: number;
  busId: string;
  latitude: number;
  longitude: number;
  velocidade: number;
  gpsFix: boolean;
  hdop: number;
  satelites: number;
  createdAt?: string;
}
