import * as Location from "expo-location";
import React, {
  createContext,
  ReactNode,
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import MapView, { LatLng, Marker, Polyline } from "react-native-maps";

type MapContextValue = {
  mapRef: React.RefObject<MapView>;
  isLoaded: boolean;
};

const MapContext = createContext<MapContextValue | null>(null);

export function useMap() {
  const context = useContext(MapContext);
  if (!context) throw new Error("useMap must be used within a Map");
  return context;
}

type MapProps = {
  children?: ReactNode;
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta?: number;
    longitudeDelta?: number;
  };
  className?: string; // optional styling placeholder
};

export function Map({ children, initialRegion, className }: MapProps) {
  const mapRef = useRef<MapView>(null) as RefObject<MapView>;
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <MapContext.Provider value={{ mapRef, isLoaded }}>
      {/* 1. Coloquei um backgroundColor claro. Se a tela ficar bege, significa 
             que o problema é apenas o download das imagens (internet/bloqueio) */}
      <View
        style={{ flex: 1, backgroundColor: "#E5E3DF" }}
        className={className}
      >
        <MapView
          ref={mapRef}
          style={{ flex: 1 }} // 2. OBRIGATÓRIO voltar isso para esconder o fundo preto do Google
          initialRegion={{
            latitude: initialRegion?.latitude ?? -3.6869,
            longitude: initialRegion?.longitude ?? -40.3486,
            latitudeDelta: initialRegion?.latitudeDelta ?? 0.01,
            longitudeDelta: initialRegion?.longitudeDelta ?? 0.01,
          }}
          onMapReady={() => setIsLoaded(true)}
        >
          {children}
        </MapView>

        <MapControls />

        {!isLoaded && (
          <View
            style={{
              position: "absolute",
              inset: 0,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(255,255,255,0.8)",
            }}
          >
            <ActivityIndicator size="small" color="#999" />
          </View>
        )}
      </View>
    </MapContext.Provider>
  );
}

// MARKERS
type MapMarkerProps = {
  coordinate: LatLng;
  label?: string;
  onPress?: () => void;
};

export function MapMarker({ coordinate, label, onPress }: MapMarkerProps) {
  return (
    <Marker coordinate={coordinate} onPress={onPress}>
      <View style={{ alignItems: "center" }}>
        <View
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: "blue",
            borderWidth: 2,
            borderColor: "white",
          }}
        />
        {label && (
          <Text style={{ fontSize: 10, fontWeight: "600", color: "black" }}>
            {label}
          </Text>
        )}
      </View>
    </Marker>
  );
}

// USER LOCATION
type MapUserLocationProps = {
  visible?: boolean;
  onLocation?: (location: LatLng) => void;
};

export function MapUserLocation({
  visible = true,
  onLocation,
}: MapUserLocationProps) {
  const { mapRef } = useMap();
  const [location, setLocation] = useState<LatLng | null>(null);

  useEffect(() => {
    let mounted = true;
    if (!visible) return;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({});
      if (!mounted) return;
      const coords = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };
      setLocation(coords);
      onLocation?.(coords);

      if (mapRef.current) {
        mapRef.current.animateCamera({ center: coords, zoom: 16 });
      }
    })();

    return () => {
      mounted = false;
    };
  }, [visible]);

  if (!visible || !location) return null;

  return <MapMarker coordinate={location} label="Você está aqui" />;
}

// ROUTE
type MapRouteProps = {
  coordinates: LatLng[];
  color?: string;
  width?: number;
};

export function MapRoute({
  coordinates,
  color = "#4285F4",
  width = 3,
}: MapRouteProps) {
  if (coordinates.length < 2) return null;
  return (
    <Polyline
      coordinates={coordinates}
      strokeColor={color}
      strokeWidth={width}
    />
  );
}

// CONTROLS
type MapControlsProps = {
  zoomStep?: number;
};

export function MapControls({ zoomStep = 1 }: MapControlsProps) {
  const { mapRef, isLoaded } = useMap();
  const [currentZoom, setCurrentZoom] = useState(16);

  if (!isLoaded) return null;

  const changeZoom = async (delta: number) => {
    if (!mapRef.current) return;
    const camera = await mapRef.current.getCamera();
    const zoom = camera?.zoom ?? currentZoom;
    const newZoom = zoom + delta;
    setCurrentZoom(newZoom);
    mapRef.current.animateCamera({ zoom: newZoom });
  };

  return (
    <View
      style={{
        position: "absolute",
        bottom: 10,
        right: 10,
        flexDirection: "column",
      }}
    >
      <Pressable
        onPress={() => changeZoom(zoomStep)}
        style={{ marginBottom: 4, padding: 8, backgroundColor: "white" }}
      >
        <Text style={{ fontSize: 18 }}>+</Text>
      </Pressable>
      <Pressable
        onPress={() => changeZoom(-zoomStep)}
        style={{ padding: 8, backgroundColor: "white" }}
      >
        <Text style={{ fontSize: 18 }}>−</Text>
      </Pressable>
    </View>
  );
}
