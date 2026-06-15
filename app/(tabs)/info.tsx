import { Bus, Info, MapPin, PhoneCall } from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";

const items = [
  "Funcionamento de Segunda a Sexta",
  "Não opera em feriados",
  "Horários sujeitos a alteração",
  "Posição do Ônibus em tempo real é aproximada",
];

function Observations() {
  return (
    <View style={{ marginTop: 10 }}>
      {items.map((item, index) => (
        <View
          key={index}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 6,
          }}
        >
          <View
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: "#10367d",
              marginRight: 8,
            }}
          />
          <Text style={{ fontSize: 14, color: "#6b7280" }}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

export default function TabTwoScreen() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#ebebeb" }}
      showsVerticalScrollIndicator={true}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          paddingBottom: 2,
          margin: 10,
        }}
      >
        <Info size={20} className="ml-[16px]" color="#10367d" />
        <Text className="pl-[6px] text-xl font-semibold">
          Sobre o IntraCampus
        </Text>
      </View>
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 8,
          padding: 16,
          height: 200,
          margin: 10,
        }}
      >
        <ScrollView
          style={{ maxHeight: 160 }}
          showsVerticalScrollIndicator={true}
        >
          <View style={{ flexDirection: "row" }}>
            <View className="w-8 h-8 rounded-full bg-[#10367d] items-center justify-center">
              <Bus size={16} color="#ebebeb" />
            </View>
            <Text className="pl-[6px] pb-[2px] text-lg font-semibold">
              Intracampus UFC Sobral
            </Text>
          </View>
          <Text className="mt-[2px] ml-[34px] text-sm text-gray-500">
            Serviço de transporte gratuito entre os campus Derby e Mucambinho da
            Universidade Federal do Ceará em Sobral.
          </Text>

          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <View className="w-8 h-8 rounded-full bg-[#10367d] items-center justify-center">
              <MapPin size={16} color="#ebebeb" />
            </View>
            <Text className="pl-[6px] pb-[2px] text-lg font-semibold">
              Campus atendidos
            </Text>
          </View>
          <Text className="mt-[2px] ml-[34px] text-sm text-gray-500">
            Campus Derby (Bloco da Medicina) e Campus Mucambinho (Bloco de
            Engenharia)
          </Text>

          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <View className="w-8 h-8 rounded-full bg-[#10367d] items-center justify-center">
              <PhoneCall size={16} color="#ebebeb" />
            </View>
            <Text className="pl-[6px] pb-[2px] text-lg font-semibold">
              Contato
            </Text>
          </View>
          <Text className="mt-[2px] ml-[34px] text-sm text-gray-500">
            Secretaria de Transportes da UFC Sobral - (88) 3611-1234
          </Text>
        </ScrollView>
      </View>

      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 8,
          padding: 16,
          height: 180,
          margin: 10,
        }}
      >
        <Text className="text-lg font-semibold">Observações</Text>
        <Observations />
      </View>

      <Text className="text-center text-sm text-gray-500 mt-[60px] ">
        © 2026 Intracker v1.0.0 - UFC Sobral
      </Text>
    </ScrollView>
  );
}
