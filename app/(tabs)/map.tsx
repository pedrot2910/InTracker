import * as Location from "expo-location";
import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import { useLiveLocation } from "../../hooks/useLiveLocation";

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
    latitude: -3.684702,
    longitude: -40.3517338,
    nome: "Cadeia Estrupativa",
  },
  {
    latitude: -3.6855592,
    longitude: -40.3410177,
    nome: "Pedrinhas (Academia B2)",
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

  const [mapReady, setMapReady] = useState(false);

  const {
    location: busLocation,
    status: socketStatus,
    error: socketError,
  } = useLiveLocation();

  console.log("Status do socket:", socketStatus);
  console.log("Localização do ônibus:", busLocation);
  console.log("Erro do socket:", socketError);

  /*
   * Obtém a localização do usuário pelo celular.
   */
  useEffect(() => {
    async function loadUserLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          console.log("Permissão de localização não concedida");

          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({});

        setUserLocation({
          latitude: currentLocation.coords.latitude,

          longitude: currentLocation.coords.longitude,
        });
      } catch (error) {
        console.error("Erro ao obter localização do usuário:", error);
      }
    }

    void loadUserLocation();
  }, []);

  /*
   * HTML que será exibido dentro da WebView.
   */
  const mapHtml = useMemo(
    () => `
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8" />

          <meta
            name="viewport"
            content="
              width=device-width,
              initial-scale=1.0,
              maximum-scale=1.0,
              user-scalable=no
            "
          />

          <link
            rel="stylesheet"
            href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          />

          <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

          <style>
            html,
            body,
            #map {
              width: 100%;
              height: 100%;
              margin: 0;
              padding: 0;
            }

            body {
              background-color: #f0f0f0;
            }

            #map {
              background-color: #f0f0f0;
            }

            .leaflet-control-attribution {
              display: none;
            }

            .bus-marker-container {
              display: flex;
              align-items: flex-end;
              justify-content: center;
            }

            .custom-pin {
              width: 22px;
              height: 22px;
              background-color: #e63946;

              border-radius: 50% 50% 50% 0;
              border: 3px solid white;

              transform: rotate(-45deg);

              display: flex;
              align-items: center;
              justify-content: center;

              box-shadow:
                2px 2px 5px rgba(0, 0, 0, 0.4);
            }

            .custom-pin span {
              transform: rotate(45deg);
              font-size: 12px;
            }

            .stop-pin {
              width: 10px;
              height: 10px;

              background-color: white;
              border: 4px solid #005a9c;
              border-radius: 50%;

              box-shadow:
                1px 1px 4px rgba(0, 0, 0, 0.5);
            }
          </style>
        </head>

        <body>
          <div id="map"></div>

          <script>
            (function () {
              function sendMessage(data) {
                if (window.ReactNativeWebView) {
                  window.ReactNativeWebView.postMessage(
                    JSON.stringify(data)
                  );
                }
              }

              window.onerror = function (
                message,
                source,
                line,
                column
              ) {
                sendMessage({
                  type: "JS_ERROR",
                  message: String(message),
                  line: line,
                  column: column
                });

                return false;
              };

              try {
                if (typeof L === "undefined") {
                  throw new Error(
                    "A biblioteca Leaflet não foi carregada."
                  );
                }

                var map = L.map("map", {
                  zoomControl: false
                }).setView(
                  [-3.688, -40.353],
                  15
                );

                L.tileLayer(
                  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
                  {
                    maxZoom: 19
                  }
                ).addTo(map);

                L.control
                  .zoom({
                    position: "bottomright"
                  })
                  .addTo(map);

                var userMarker = null;
                var busMarker = null;

                var animationFrameId = null;
                var animationStartTime = null;

                var busIcon = L.divIcon({
                  html:
                    '<div class="custom-pin">' +
                    "<span></span>" +
                    "</div>",

                  className:
                    "bus-marker-container",

                  iconSize: [32, 38],
                  iconAnchor: [16, 38]
                });

                var stopIcon = L.divIcon({
                  html:
                    '<div class="stop-pin"></div>',

                  className: "",
                  iconSize: [18, 18],
                  iconAnchor: [9, 9]
                });

                var rotaIdaCoords =
                  ${JSON.stringify(rotaIda)};

                var rotaVoltaCoords =
                  ${JSON.stringify(rotaVolta)};

                var stopsLocs =
                  ${JSON.stringify(paradasPrincipais)};

                var activeRouteLine = L.polyline(
                  [],
                  {
                    color: "#005a9c",
                    weight: 6,
                    opacity: 0.85,
                    lineCap: "round",
                    lineJoin: "round"
                  }
                ).addTo(map);

                var activeDirection = null;

                var activeSegmentIndex = 0;

                /*
                 * Desenha as paradas.
                 */
                stopsLocs.forEach(
                  function (stop) {
                    L.marker(
                      [
                        stop.latitude,
                        stop.longitude
                      ],
                      {
                        icon: stopIcon,
                        zIndexOffset: -100
                      }
                    )
                      .addTo(map)
                      .bindPopup(
                        "<b>🚏 Parada:</b><br>" +
                        stop.nome
                      );
                  }
                );

                function findNearestRouteSegment(
                  location,
                  route
                ) {
                  var bestMatch = {
                    distanceSquared: Infinity,
                    segmentIndex: 0,
                    projectedLocation: {
                      latitude: route[0].latitude,
                      longitude: route[0].longitude
                    }
                  };

                  for (
                    var index = 0;
                    index < route.length - 1;
                    index++
                  ) {
                    var start = route[index];
                    var end = route[index + 1];

                    var latitudeDelta =
                      end.latitude - start.latitude;

                    var longitudeDelta =
                      end.longitude - start.longitude;

                    var segmentLengthSquared =
                      latitudeDelta * latitudeDelta +
                      longitudeDelta * longitudeDelta;

                    var progress = 0;

                    if (segmentLengthSquared > 0) {
                      progress =
                        (
                          (
                            location.latitude -
                            start.latitude
                          ) *
                            latitudeDelta +
                          (
                            location.longitude -
                            start.longitude
                          ) *
                            longitudeDelta
                        ) /
                        segmentLengthSquared;
                    }

                    progress = Math.max(
                      0,
                      Math.min(1, progress)
                    );

                    var projectedLatitude =
                      start.latitude +
                      latitudeDelta * progress;

                    var projectedLongitude =
                      start.longitude +
                      longitudeDelta * progress;

                    var distanceLatitude =
                      location.latitude -
                      projectedLatitude;

                    var distanceLongitude =
                      location.longitude -
                      projectedLongitude;

                    var distanceSquared =
                      distanceLatitude *
                        distanceLatitude +
                      distanceLongitude *
                        distanceLongitude;

                    if (
                      distanceSquared <
                      bestMatch.distanceSquared
                    ) {
                      bestMatch = {
                        distanceSquared:
                          distanceSquared,

                        segmentIndex:
                          index,

                        projectedLocation: {
                          latitude:
                            projectedLatitude,

                          longitude:
                            projectedLongitude
                        }
                      };
                    }
                  }

                  return bestMatch;
                }

                function selectActiveRoute(location) {
                  var idaMatch = findNearestRouteSegment(
                    location,
                    rotaIdaCoords
                  );

                  var voltaMatch = findNearestRouteSegment(
                    location,
                    rotaVoltaCoords
                  );

                  var selectedDirection =
                    activeDirection;

                  if (!selectedDirection) {
                    selectedDirection =
                      idaMatch.distanceSquared <=
                      voltaMatch.distanceSquared
                        ? "ida"
                        : "volta";
                  } else {
                    var currentMatch =
                      selectedDirection === "ida"
                        ? idaMatch
                        : voltaMatch;
                    
                    var otherMatch =
                      selectedDirection === "ida"
                        ? voltaMatch
                        : idaMatch;

                    var currentRoute =
                      selectedDirection === "ida"
                        ? rotaIdaCoords
                        : rotaVoltaCoords;

                    var isNearRouteEnd =
                      activeSegmentIndex >=
                      currentRoute.length - 2;

                    var otherRouteIsClearlyCloser =
                      otherMatch.distanceSquared <
                      currentMatch.distanceSquared * 0.45;

                    if (
                      otherRouteIsClearlyCloser ||
                      (
                        isNearRouteEnd &&
                        otherMatch.distanceSquared <
                        currentMatch.distanceSquared
                      )
                    ) {
                      selectedDirection =
                        selectedDirection === "ida"
                          ? "volta"
                          : "ida";
                      }
                  }

                  var selectedRoute =
                    selectedDirection === "ida"
                      ? rotaIdaCoords
                      : rotaVoltaCoords;

                  var selectedMatch =
                    selectedDirection === "ida"
                      ? idaMatch
                      : voltaMatch;

                  if (
                    activeDirection !==
                    selectedDirection
                  ) {
                    activeSegmentIndex =
                      selectedMatch.segmentIndex;  
                  } else {
                    activeSegmentIndex =
                      Math.max(
                        activeSegmentIndex,
                        selectedMatch.segmentIndex                        
                      )  
                  }

                  activeDirection =
                    selectedDirection;

                  return {
                    direction: selectedDirection,
                    route: selectedRoute,
                    match: selectedMatch
                  };
                }

                function updateRemainingRoute(
                  busLocation
                ) {
                  var previousDirection =
                    activeDirection;

                  var selection =
                    selectActiveRoute(
                      busLocation
                    );

                  var route =
                    selection.route;

                  var routeColor =
                    selection.direction === "ida"
                      ? "#005a9c"
                      : "#009a44";

                  /*
                  * A linha começa na projeção da
                  * posição do ônibus sobre a rota.
                  */
                  var remainingCoordinates = [
                    [
                      selection.match
                        .projectedLocation.latitude,

                      selection.match
                        .projectedLocation.longitude
                    ]
                  ];

                  /*
                  * Usa activeSegmentIndex para impedir
                  * que trechos já percorridos reapareçam.
                  */
                  for (
                    var index =
                      activeSegmentIndex + 1;

                    index < route.length;

                    index++
                  ) {
                    remainingCoordinates.push([
                      route[index].latitude,
                      route[index].longitude
                    ]);
                  }

                  activeRouteLine.setStyle({
                    color: routeColor
                  });

                  activeRouteLine.setLatLngs(
                    remainingCoordinates
                  );

                  if (busMarker) {
                    busMarker.setPopupContent(
                      "<b>Ônibus IntraCampus</b>" +
                      "<br>Sentido: " +
                      (
                        selection.direction === "ida"
                          ? "Ida"
                          : "Volta"
                      )
                    );
                  }

                  if (
                    previousDirection !==
                    activeDirection
                  ) {
                    sendMessage({
                      type: "ROUTE_CHANGED",
                      direction:
                        activeDirection
                    });
                  }
                }

                function animateBus(
                  currentTime,
                  startLocation,
                  endLocation,
                  duration
                ) {
                  if (
                    animationStartTime === null
                  ) {
                    animationStartTime =
                      currentTime;
                  }

                  var elapsed =
                    currentTime -
                    animationStartTime;

                  var progress = Math.min(
                    elapsed /
                      Math.max(duration, 1),
                    1
                  );

                  /*
                   * Movimento mais suave.
                   */
                  var easedProgress =
                    1 -
                    Math.pow(
                      1 - progress,
                      3
                    );

                  var currentLatitude =
                    startLocation.latitude +
                    (
                      endLocation.latitude -
                      startLocation.latitude
                    ) *
                      easedProgress;

                  var currentLongitude =
                    startLocation.longitude +
                    (
                      endLocation.longitude -
                      startLocation.longitude
                    ) *
                      easedProgress;

                  var currentBusLocation = {
                    latitude: currentLatitude,
                    longitude: currentLongitude
                  };

                  if (busMarker) {
                    busMarker.setLatLng([
                      currentLatitude,
                      currentLongitude
                    ]);
                    updateRemainingRoute(
                      currentBusLocation
                    )
                  }

                  if (progress < 1) {
                    animationFrameId =
                      requestAnimationFrame(
                        function (time) {
                          animateBus(
                            time,
                            startLocation,
                            endLocation,
                            duration
                          );
                        }
                      );
                  }
                }

                /*
                 * Recebe do React Native a nova
                 * posição do ônibus.
                 */
                window.updateBusPosition =
                  function (
                    newLocation,
                    duration
                  ) {
                    try {
                      if (
                        !newLocation ||
                        typeof newLocation.latitude !==
                          "number" ||
                        typeof newLocation.longitude !==
                          "number"
                      ) {
                        throw new Error(
                          "Localização inválida recebida pelo mapa."
                        );
                      }

                      var coordinates = [
                        newLocation.latitude,
                        newLocation.longitude
                      ];

                      /*
                       * Primeira posição recebida:
                       * cria o marcador.
                       */
                      if (!busMarker) {
                        busMarker = L.marker(
                          coordinates,
                          {
                            icon: busIcon,
                            zIndexOffset: 1000
                          }
                        )
                          .addTo(map)
                          .bindPopup(
                            "<b>Ônibus IntraCampus</b>"
                          );

                        map.setView(
                          coordinates,
                          17
                        );

                        updateRemainingRoute(
                          newLocation
                        );

                        sendMessage({
                          type: "BUS_UPDATED",
                          latitude:
                            newLocation.latitude,
                          longitude:
                            newLocation.longitude
                        });

                        return;
                      }

                      /*
                       * Posição atual do marcador.
                       */
                      var currentPosition =
                        busMarker.getLatLng();

                      var startLocation = {
                        latitude:
                          currentPosition.lat,

                        longitude:
                          currentPosition.lng
                      };

                      if (animationFrameId) {
                        cancelAnimationFrame(
                          animationFrameId
                        );
                      }

                      animationStartTime = null;

                      animationFrameId =
                        requestAnimationFrame(
                          function (time) {
                            animateBus(
                              time,
                              startLocation,
                              newLocation,
                              duration || 1200
                            );
                          }
                        );

                      sendMessage({
                        type: "BUS_UPDATED",
                        latitude:
                          newLocation.latitude,
                        longitude:
                          newLocation.longitude
                      });
                    } catch (error) {
                      sendMessage({
                        type: "JS_ERROR",
                        message:
                          error &&
                          error.message
                            ? error.message
                            : String(error)
                      });
                    }
                  };

                /*
                 * Recebe a posição do usuário.
                 */
                window.updateUserPosition =
                  function (userLocation) {
                    try {
                      if (
                        !userLocation ||
                        typeof userLocation.lat !==
                          "number" ||
                        typeof userLocation.lng !==
                          "number"
                      ) {
                        return;
                      }

                      var coordinates = [
                        userLocation.lat,
                        userLocation.lng
                      ];

                      if (userMarker) {
                        userMarker.setLatLng(
                          coordinates
                        );

                        return;
                      }

                      userMarker =
                        L.circleMarker(
                          coordinates,
                          {
                            color: "white",
                            fillColor: "#4285f4",
                            fillOpacity: 1,
                            radius: 8,
                            weight: 2
                          }
                        )
                          .addTo(map)
                          .bindPopup(
                            "<b>Você está aqui</b>"
                          );
                    } catch (error) {
                      sendMessage({
                        type: "JS_ERROR",
                        message:
                          error &&
                          error.message
                            ? error.message
                            : String(error)
                      });
                    }
                  };

                /*
                 * Aguarda a WebView calcular o
                 * tamanho do mapa.
                 */
                setTimeout(function () {
                  map.invalidateSize();

                  sendMessage({
                    type: "MAP_READY"
                  });
                }, 300);
              } catch (error) {
                sendMessage({
                  type: "JS_ERROR",
                  message:
                    error && error.message
                      ? error.message
                      : String(error)
                });
              }
            })();
          </script>
        </body>
      </html>
    `,
    [],
  );

  const mapSource = useMemo(
    () => ({
      html: mapHtml,
    }),
    [mapHtml],
  );

  /*
   * Recebe mensagens enviadas pelo HTML.
   */
  function handleMapMessage(event: WebViewMessageEvent) {
    try {
      const message = JSON.parse(event.nativeEvent.data);

      console.log("Mensagem recebida da WebView:", message);

      if (message.type === "MAP_READY") {
        console.log("Leaflet inicializado com sucesso");

        setMapReady(true);
        return;
      }

      if (message.type === "BUS_UPDATED") {
        console.log("Marcador do ônibus atualizado:", message);

        return;
      }

      if (message.type === "JS_ERROR") {
        console.error("Erro dentro do mapa:", message.message);
      }

      if (message.type === "ROUTE_CHANGED") {
        console.log("Sentido atual do ônibus: ", message.direction);

        return;
      }
    } catch {
      console.log(
        "Mensagem não reconhecida da WebView:",
        event.nativeEvent.data,
      );
    }
  }

  /*
   * Envia ao mapa a localização do ônibus.
   */
  useEffect(() => {
    if (!mapReady || !busLocation || !webViewRef.current) {
      return;
    }

    const latitude = Number(busLocation.latitude);

    const longitude = Number(busLocation.longitude);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      console.warn("Coordenadas inválidas do ônibus:", busLocation);

      return;
    }

    const position: LatLng = {
      latitude,
      longitude,
    };

    console.log("Enviando posição para o mapa:", position);

    webViewRef.current.injectJavaScript(`
      if (
        typeof window.updateBusPosition ===
        "function"
      ) {
        window.updateBusPosition(
          ${JSON.stringify(position)},
          1200
        );
      } else {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: "JS_ERROR",
            message:
              "A função updateBusPosition não existe."
          })
        );
      }

      true;
    `);
  }, [busLocation, mapReady]);

  /*
   * Envia ao mapa a localização do usuário.
   */
  useEffect(() => {
    if (!mapReady || !userLocation || !webViewRef.current) {
      return;
    }

    const userPosition = {
      lat: userLocation.latitude,
      lng: userLocation.longitude,
    };

    webViewRef.current.injectJavaScript(`
      if (
        typeof window.updateUserPosition ===
        "function"
      ) {
        window.updateUserPosition(
          ${JSON.stringify(userPosition)}
        );
      }

      true;
    `);
  }, [userLocation, mapReady]);

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={mapSource}
        style={styles.webView}
        originWhitelist={["*"]}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        onMessage={handleMapMessage}
        onError={(event) => {
          console.error("Erro nativo da WebView:", event.nativeEvent);
        }}
        onHttpError={(event) => {
          console.error(
            "Erro HTTP da WebView:",
            event.nativeEvent.statusCode,
            event.nativeEvent.url,
          );
        }}
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
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },

  webView: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },

  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
});
