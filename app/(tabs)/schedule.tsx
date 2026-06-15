import {
  ArrowRight,
  BellRing,
  ChevronDown,
  ChevronUp,
  Clock,
} from "lucide-react-native";
import { useRef, useState } from "react";
import {
  Animated,
  LayoutAnimation,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

// Array completo com horários reais de saída e chegada
const allRoutes = [
  { from: "Mucambinho", to: "Derby", departure: "07:00", arrival: "07:25" },
  { from: "Derby", to: "Mucambinho", departure: "07:25", arrival: "07:35" },
  { from: "Mucambinho", to: "Derby", departure: "07:45", arrival: "08:10" },
  { from: "Derby", to: "Mucambinho", departure: "08:10", arrival: "08:25" },
  { from: "Mucambinho", to: "Derby", departure: "09:00", arrival: "09:25" },
  { from: "Derby", to: "Mucambinho", departure: "09:25", arrival: "09:40" },
  { from: "Mucambinho", to: "Derby", departure: "10:00", arrival: "10:25" },
  { from: "Derby", to: "Mucambinho", departure: "10:25", arrival: "10:40" },
  { from: "Mucambinho", to: "Derby", departure: "11:00", arrival: "11:25" },
  { from: "Derby", to: "Mucambinho", departure: "11:25", arrival: "11:40" },
  { from: "Mucambinho", to: "Derby", departure: "11:50", arrival: "12:15" },
  { from: "Derby", to: "Mucambinho", departure: "12:15", arrival: "12:30" },
  { from: "Mucambinho", to: "Derby", departure: "12:40", arrival: "13:05" },
  { from: "Derby", to: "Mucambinho", departure: "13:05", arrival: "13:20" },
  { from: "Mucambinho", to: "Derby", departure: "13:30", arrival: "13:50" },
  { from: "Derby", to: "Mucambinho", departure: "13:50", arrival: "14:00" },
  { from: "Mucambinho", to: "Derby", departure: "14:10", arrival: "14:35" },
  { from: "Derby", to: "Mucambinho", departure: "14:35", arrival: "14:50" },
  { from: "Mucambinho", to: "Derby", departure: "17:20", arrival: "17:45" },
  { from: "Derby", to: "Mucambinho", departure: "17:45", arrival: "18:00" },
  { from: "Mucambinho", to: "Derby", departure: "18:20", arrival: "18:35" },
  { from: "Derby", to: "Mucambinho", departure: "18:35", arrival: "18:50" },
  { from: "Mucambinho", to: "Derby", departure: "19:20", arrival: "19:45" },
  { from: "Derby", to: "Mucambinho", departure: "19:45", arrival: "20:00" },
  { from: "Mucambinho", to: "Derby", departure: "21:40", arrival: "22:05" },
  { from: "Derby", to: "Mucambinho", departure: "22:05", arrival: "22:30" },
];

function timeToMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

// Ordena cronologicamente pela hora de saída
const allRoutesSorted = allRoutes
  .slice()
  .sort((a, b) => timeToMinutes(a.departure) - timeToMinutes(b.departure));

function RouteCard({ route, isNext, isPast }) {
  const [expanded, setExpanded] = useState(false);
  const animation = useRef(new Animated.Value(75)).current;
  const collapsedHeight = 75;
  const expandedHeight = 500;

  function toggleExpanded() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);

    Animated.timing(animation, {
      toValue: expanded ? collapsedHeight : expandedHeight,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }

  return (
    <View
      style={{
        backgroundColor: isNext ? "#74b4d9" : isPast ? "#f3f4f6" : "#fff",
        borderRadius: 8,
        padding: 16,
        marginHorizontal: 10,
        marginVertical: 5,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flexDirection: "column", alignItems: "center" }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: isNext ? "#fff" : isPast ? "#6b7280" : "#1f2937",
            }}
          >
            {route.departure}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: isNext ? "#e0e0e0" : isPast ? "#9ca3af" : "#6b7280",
            }}
          >
            Saída
          </Text>
        </View>
        <View style={{ marginHorizontal: 8 }}>
          <ArrowRight
            size={12}
            color={isNext ? "#fff" : isPast ? "#9ca3af" : "#10367d"}
          />
        </View>
        <View style={{ flexDirection: "column", alignItems: "center" }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: isNext ? "#fff" : isPast ? "#6b7280" : "#1f2937",
            }}
          >
            {route.arrival}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: isNext ? "#e0e0e0" : isPast ? "#9ca3af" : "#6b7280",
            }}
          >
            Chegada
          </Text>
        </View>
        <Text
          style={{
            marginLeft: 30,
            fontSize: 14,
            color: isNext ? "#fff" : isPast ? "#6b7280" : "#1f2937",
          }}
        >
          {route.from} → {route.to}
        </Text>

        <TouchableOpacity
          onPress={toggleExpanded}
          style={{ marginLeft: 4, marginRight: 6 }}
        >
          {expanded ? (
            <ChevronUp
              size={24}
              color={isNext ? "#fff" : isPast ? "#6b7280" : "#1f2937"}
            />
          ) : (
            <ChevronDown
              size={24}
              color={isNext ? "#fff" : isPast ? "#6b7280" : "#1f2937"}
            />
          )}
        </TouchableOpacity>
      </View>
      {expanded && (
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            marginTop: 10,
            paddingTop: 10,
          }}
        >
          {route.from === "Mucambinho" ? (
            <Text
              style={{
                fontSize: 12,
                color: isNext ? "#e0e0e0" : isPast ? "#9ca3af" : "#6b7280",
              }}
            >
              Mucambinho → Santa Casa → SPA → Famed
            </Text>
          ) : (
            <Text
              style={{
                fontSize: 12,
                color: isNext ? "#e0e0e0" : isPast ? "#9ca3af" : "#6b7280",
              }}
            >
              Famed → Receita Federal → SPA → Mucambinho
            </Text>
          )}

          <TouchableOpacity
            onPress={() => {}}
            style={{
              marginTop: 10,
              marginBottom: 10,
              backgroundColor: isNext ? "#fff" : isPast ? "#10367d" : "#f3f4f6",
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 4,
            }}
          >
            <BellRing
              size={16}
              color={isNext ? "#74b4d9" : isPast ? "#fff" : "#6b7280"}
            ></BellRing>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
export function Schedule() {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const nextRouteIndex = allRoutesSorted.findIndex(
    (r) => currentMinutes < timeToMinutes(r.departure),
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#ebebeb" }}>
      <View style={{ flexDirection: "row", alignItems: "center", padding: 16 }}>
        <Clock size={20} color="#10367d" />
        <Text
          style={{
            marginLeft: 6,
            fontSize: 20,
            color: "#000",
            fontWeight: "600",
          }}
        >
          Horários do IntraCampus
        </Text>
      </View>

      <Text
        style={{
          paddingLeft: 18,
          paddingTop: 0,
          paddingBottom: 8,
          color: "#9ca3af",
          fontSize: 12,
        }}
      >
        Horários estimados de Segunda a Sexta
      </Text>

      {allRoutesSorted.map((route, index) => (
        <RouteCard
          key={index}
          route={route}
          isNext={index === nextRouteIndex}
          isPast={index < nextRouteIndex}
        />
      ))}

      <Text
        style={{
          textAlign: "center",
          color: "#9ca3af",
          marginTop: 30,
          marginBottom: 30,
        }}
      >
        © 2026 Intracker v1.0.0 - UFC Sobral
      </Text>
    </ScrollView>
  );
}

export default Schedule;
