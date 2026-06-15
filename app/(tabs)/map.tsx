import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

type LatLng = { latitude: number; longitude: number };

const rotaIda = [
  { latitude: -3.693324145584993, longitude: -40.35491087578721 }, //UFC Mucambinho
  { latitude: -3.6922313437526753, longitude: -40.35507600462318 }, //Entrada da UFC Mucambinho
  { latitude: -3.6924275422841695, longitude: -40.356092895665 }, //curva da UFC Mucambinho
  { latitude: -3.692906695071259, longitude: -40.3560276421387 }, //curva ao lado da ufc mucambinho
  { latitude: -3.692529160391632, longitude: -40.35878444692039 }, //Santa Casa
  { latitude: -3.692363760379653, longitude: -40.3595746358754 }, //Curva 1 da Santa Casa
  { latitude: -3.6920807304334837, longitude: -40.35945268250236 }, //Curva 2 da Santa Casa
  { latitude: -3.69186488257903, longitude: -40.35756304110375 }, //ponto 1 reta pós Santa Casa
  { latitude: -3.6916585713925802, longitude: -40.356539624237904 }, //ponto 2 reta pós Santa Casa
  { latitude: -3.6914081066263598, longitude: -40.35448583510997 }, //ponto 3 reta pós Santa Casa
  { latitude: -3.6912192871782468, longitude: -40.352506052730426 }, //curva da unimed
  { latitude: -3.6898446811923407, longitude: -40.35266648885179 }, //reta pós curva da unimed
  { latitude: -3.6884892677167196, longitude: -40.35304157350797 }, //SPA (ida)
  { latitude: -3.688362819410868, longitude: -40.353144048619654 }, //Primeira curva pós SPA
  { latitude: -3.6876396571635004, longitude: -40.35223303452374 }, //Segunda curva pós SPA
  { latitude: -3.686345173218746, longitude: -40.353557271457404 }, //Terceira curva pós SPA
  { latitude: -3.68485978613568, longitude: -40.35190502007958 }, //Cadeia Criativa
  { latitude: -3.683703621911781, longitude: -40.35073893918525 }, //Proximo ao pão mix
  { latitude: -3.6820937799789317, longitude: -40.34900740319477 }, //sinal pós pão mix
  { latitude: -3.681483811867331, longitude: -40.34833753159456 }, //Curva pós pão mix
  { latitude: -3.681902173706517, longitude: -40.34788580338429 }, //sinal 2 pós pão mix
  { latitude: -3.6822954008324227, longitude: -40.346679401897916 }, //reta a caminho do goiabão
  { latitude: -3.6825790020320635, longitude: -40.345808794366974 }, //continuação da reta a caminho do goiabão
  { latitude: -3.683483824303155, longitude: -40.343237570052786 }, //sinal antes do goiabão
  { latitude: -3.6836638883463833, longitude: -40.34280452173103 }, //goiabão
  { latitude: -3.6856220763067773, longitude: -40.34097175089185 }, //B2
  { latitude: -3.687028728438435, longitude: -40.33822405694662 }, //curva pós B2
  { latitude: -3.6839340457472365, longitude: -40.33665949320282 }, //reta entre a curva pós B2 e a faculdade de medicina
  { latitude: -3.682442194444775, longitude: -40.33620221815818 }, //curva antes da faculdade de medicina
  { latitude: -3.6822104457864278, longitude: -40.3367839806494 }, //Faculdade de Medicina
];

const rotaVolta = [
  { latitude: -3.681708755760157, longitude: -40.33722666229517 },
  { latitude: -3.681283727092519, longitude: -40.3398523506152 },
  { latitude: -3.682380569425489, longitude: -40.34098833158584 },
  { latitude: -3.6833126204914532, longitude: -40.34194833464528 },
  { latitude: -3.6848380407731156, longitude: -40.34358588314763 },
  { latitude: -3.6835292648924813, longitude: -40.34574884772713 },
  { latitude: -3.6829028099331724, longitude: -40.34702574986973 },
  { latitude: -3.681947874997006, longitude: -40.34787421060849 },
  { latitude: -3.6823879865386484, longitude: -40.34835428375866 },
  { latitude: -3.6832852736864248, longitude: -40.349340975511225 },
  { latitude: -3.6845547517365715, longitude: -40.350674636370194 },
  { latitude: -3.6858872029607572, longitude: -40.35205536711464 },
  { latitude: -3.6873082714244942, longitude: -40.353577292870995 },
  { latitude: -3.6887369940838046, longitude: -40.353412988765626 },
  { latitude: -3.6902093634406974, longitude: -40.35317659227865 },
  { latitude: -3.690576494589637, longitude: -40.355303236934624 },
  { latitude: -3.693324145584993, longitude: -40.35491087578721 },
];

// AJUSTE AQUI: Como o fim da ida é diferente do começo da volta, não usamos mais o .slice(1)
const ROTA_COMPLETA_ONIBUS = [...rotaIda, ...rotaVolta];

const paradasPrincipais = [
  {
    latitude: -3.693324145584993,
    longitude: -40.35491087578721,
    nome: "UFC Mucambinho",
  },
  {
    latitude: -3.692529160391632,
    longitude: -40.35878444692039,
    nome: "Santa Casa",
  },
  {
    latitude: -3.6884892677167196,
    longitude: -40.35304157350797,
    nome: "SPA (ida)",
  },
  {
    latitude: -3.6822104457864278,
    longitude: -40.3367839806494,
    nome: "Faculdade de Medicina",
  },
  {
    latitude: -3.683523711111264,
    longitude: -40.342166708141605,
    nome: "Receita Federal (volta)",
  },
  {
    latitude: -3.688859823280553,
    longitude: -40.35340510390628,
    nome: "SPA (volta)",
  },
];
const TEMPO_ENTRE_PONTOS = 1500; // 1.5 segundos

export default function MapScreen() {
  const webViewRef = useRef<WebView>(null);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [busData, setBusData] = useState({
    pontoAnteriorIndex: 0,
    pontoProximoIndex: 1,
  });

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({});
      setUserLocation(loc.coords);
    })();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBusData((prev) => {
        const proximo =
          (prev.pontoProximoIndex + 1) % ROTA_COMPLETA_ONIBUS.length;
        return {
          pontoAnteriorIndex: prev.pontoProximoIndex,
          pontoProximoIndex: proximo,
        };
      });
    }, TEMPO_ENTRE_PONTOS);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (webViewRef.current) {
      const isIda = busData.pontoProximoIndex < rotaIda.length;
      let rotaRestante = [];
      let corRota = "";

      if (isIda) {
        rotaRestante = rotaIda.slice(busData.pontoProximoIndex);
        corRota = "#005a9c"; // Azul
      } else {
        rotaRestante = ROTA_COMPLETA_ONIBUS.slice(busData.pontoProximoIndex);
        corRota = "#009a44"; // Verde
      }

      const pontoStart = ROTA_COMPLETA_ONIBUS[busData.pontoAnteriorIndex];
      const pontoEnd = ROTA_COMPLETA_ONIBUS[busData.pontoProximoIndex];

      const script = `
        updateMap(
          ${JSON.stringify(pontoStart)},
          ${JSON.stringify(pontoEnd)},
          ${JSON.stringify(rotaRestante)}, 
          "${corRota}",
          ${TEMPO_ENTRE_PONTOS},
          ${JSON.stringify(userLocation ? { lat: userLocation.latitude, lng: userLocation.longitude } : null)},
          ${JSON.stringify(paradasPrincipais)}
        );
        true;
      `;
      webViewRef.current.injectJavaScript(script);
    }
  }, [userLocation, busData]);

  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body { padding: 0; margin: 0; }
        #map { height: 100vh; width: 100vw; background-color: #f0f0f0; }
        .leaflet-control-attribution { display: none; }
        
        .bus-marker-container { 
            display: flex; align-items: flex-end; justify-content: center; 
        }
        
        /* PIN DO ÔNIBUS */
        .custom-pin {
            width: 18px; height: 18px; background-color: #e63946; 
            border-radius: 50% 50% 50% 0; transform: rotate(-45deg); 
            display: flex; align-items: center; justify-content: center;
            border: 3px solid white; box-shadow: 2px 2px 5px rgba(0,0,0,0.4); 
            margin-bottom: 2px; 
            z-index: 1000; /* Garante que o ônibus fique por cima de tudo */
        }
        .custom-pin span {
            transform: rotate(45deg); font-size: 10px; margin-bottom: 2px; margin-right: 2px;
        }

        /* NOVO: PIN DAS PARADAS */
        .stop-pin {
            width: 10px; height: 10px;
            background-color: white;
            border: 4px solid #005a9c; /* Azul escuro igual a rota de ida */
            border-radius: 50%; /* Bolinha perfeita */
            box-shadow: 1px 1px 4px rgba(0,0,0,0.5);
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map', { zoomControl: false }).setView([-3.688, -40.353], 15);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map);
        L.control.zoom({ position: 'bottomright' }).addTo(map);

        var userMarker, busMarker, dynamicRouteLine;
        var animFrameId = null;
        var startTime = null;
        var paradasDesenhadas = false; // Controle para não redesenhar a parada a cada milissegundo
        
        var busIcon = L.divIcon({ 
            html: '<div class="custom-pin"><span>🚌</span></div>', 
            className: 'bus-marker-container', iconSize: [30, 36], iconAnchor: [15, 36] 
        });

        // NOVO: Ícone para as paradas
        var stopIcon = L.divIcon({
            html: '<div class="stop-pin"></div>',
            className: '', // Sem classe de animação
            iconSize: [22, 22],
            iconAnchor: [11, 11] // Centralizado
        });

        function animateBus(currentTime, startLoc, endLoc, pathRestante, color, duration) {
            if (!startTime) startTime = currentTime;
            var progress = Math.min((currentTime - startTime) / duration, 1);
            
            var currentLat = startLoc.latitude + (endLoc.latitude - startLoc.latitude) * progress;
            var currentLng = startLoc.longitude + (endLoc.longitude - startLoc.longitude) * progress;
            var currentLatLng = [currentLat, currentLng];

            busMarker.setLatLng(currentLatLng);
            dynamicRouteLine.setLatLngs([currentLatLng, [endLoc.latitude, endLoc.longitude], ...pathRestante.map(c => [c.latitude, c.longitude])]);
            dynamicRouteLine.setStyle({ color: color });

            if (progress < 1) {
                animFrameId = requestAnimationFrame(function(time) {
                    animateBus(time, startLoc, endLoc, pathRestante, color, duration);
                });
            }
        }

        // NOVO: Parâmetro stopsLocs recebido no final
        function updateMap(startLoc, endLoc, pathRestante, color, duration, userLoc, stopsLocs) {
            
            // 1. DESENHA AS PARADAS APENAS UMA VEZ
            if (!paradasDesenhadas && stopsLocs && stopsLocs.length > 0) {
                stopsLocs.forEach(function(parada) {
                    L.marker([parada.latitude, parada.longitude], { icon: stopIcon, zIndexOffset: -100 })
                     .addTo(map)
                     .bindPopup("<b>🚏 Parada:</b><br>" + parada.nome);
                });
                paradasDesenhadas = true; // Marca que já desenhou pra não repetir
            }

            // O RESTO CONTINUA IGUAL...
            if (!dynamicRouteLine) {
                dynamicRouteLine = L.polyline([], { weight: 6, opacity: 0.8, lineCap: 'round', lineJoin: 'round' }).addTo(map);
            }
            if (!busMarker) {
                busMarker = L.marker([startLoc.latitude, startLoc.longitude], { icon: busIcon, zIndexOffset: 1000 }).addTo(map).bindPopup("<b>Ônibus Intra-Campus</b>");
            }

            if (userLoc) {
                if (userMarker) { userMarker.setLatLng([userLoc.lat, userLoc.lng]); } 
                else { userMarker = L.circleMarker([userLoc.lat, userLoc.lng], { color: 'white', fillColor: '#4285F4', fillOpacity: 1, radius: 8, weight: 2 }).addTo(map).bindPopup("<b>Você está aqui</b>"); }
            }

            if (animFrameId) cancelAnimationFrame(animFrameId);
            startTime = null; 
            
            animFrameId = requestAnimationFrame(function(time) {
                animateBus(time, startLoc, endLoc, pathRestante, color, duration);
            });
        }
      </script>
    </body>
    </html>
  `;

  return (
    <View style={StyleSheet.absoluteFill}>
      <WebView
        ref={webViewRef}
        source={{ html: mapHtml }}
        style={{ flex: 1 }}
        originWhitelist={["*"]}
        javaScriptEnabled={true}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#005a9c" />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    position: "absolute",
    inset: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
});
