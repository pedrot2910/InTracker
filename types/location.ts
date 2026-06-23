export interface LocationData {
  id?: number;
  busId: string;
  latitude: number;
  longitude: number;
  velocidade: number;
  gpsFix: boolean;
  gps_fix: boolean;
  hdop: number;
  satelites: number;
  createdAt?: string;
}
