import { NewspaperIcon } from "lucide-react-native";
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

export default function HomeScreen() {
  const [expanded, setExpanded] = useState(false);
  const animation = useRef(new Animated.Value(200)).current;
  const previewHeight = 200;
  const expandedHeight = 650;
  const newsContent = `No Campus de Sobral da Universidade Federal do Ceará (UFC), um incidente envolvendo o transporte universitário chamou atenção nesta terça-feira. Um motorista do serviço de transporte intracampus teria retido um passageiro contra sua vontade durante o trajeto, conforme relatos da vítima e informações preliminares da polícia local. O passageiro foi liberado após a chegada das autoridades, e a UFC informou que abriu apuração interna, colaborando plenamente com as investigações. O episódio mobilizou equipes de segurança do campus e deixou a comunidade acadêmica em alerta. Autoridades reforçam que se trata de um caso isolado e que medidas preventivas estão sendo intensificadas para proteger alunos e funcionários. A investigação segue em andamento, e novas informações serão divulgadas assim que disponíveis.`;
  const previewContent = newsContent.slice(0, 150) + " ...";
  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);

    Animated.timing(animation, {
      toValue: expanded ? previewHeight : expandedHeight,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        padding: 12,
        paddingTop: 8,

        backgroundColor: "#ebebeb",
      }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 6,
          paddingBottom: 2,
          margin: 6,
        }}
      >
        <NewspaperIcon size={20} className="ml-[14px]" color="#10367d" />
        <Text className="pl-[6px] text-xl font-semibold">Notícias</Text>
      </View>
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 8,
          padding: 16,
          marginTop: 10,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text className="text-lg font-semibold">
            Motorista do transporte intracampus da UFC Sobral sequestra um
            chimpazé
          </Text>
        </View>
        <Animated.View
          style={{
            margin: 8,
            borderWidth: 1,
            borderTopColor: "#fff",
            borderBottomColor: "#fff",
            borderLeftColor: "#ebebeb",
            borderRightColor: "#ebebeb",
            paddingHorizontal: 12,
            height: animation,
          }}
        >
          <Text className="m-auto text-base leading-relaxed text-gray-600">
            {expanded ? newsContent : previewContent}
          </Text>
          <TouchableOpacity onPress={toggleExpanded}>
            <Text className="m-auto mt-[10px] text-base leading-relaxed text-gray-500">
              {expanded ? "Mostrar menos" : "Mostrar mais"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ScrollView>
  );
}
