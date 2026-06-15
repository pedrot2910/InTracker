import { Tabs } from "expo-router";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Bell, Bus } from "lucide-react-native";
import { useState } from "react";
import { Text, View } from "react-native";
import NotificationsModal from "../_components/NotificationsModal";

export default function TabLayout() {
  const [isNotificationsModalVisible, setNotificationsModalVisible] =
    useState(false);

  const toggleNotificationsModal = () => {
    setNotificationsModalVisible(!isNotificationsModalVisible);
  };

  return (
    <View style={{ flex: 1 }}>
      <View className="bg-white dark:bg-[#fff] ">
        {/* Header Customizado */}
        <View className="pt-[40px] pb-[10px] border-b border-gray-200 dark:border-gray-300">
          <View className="h-14 flex-row items-center px-4 gap-3">
            {/* Badge do Ícone */}
            <View className="bg-[#10367d] w-8 h-8 rounded-full items-center justify-center">
              <Bus color="#ebebeb" size={16} />
            </View>

            <View>
              <Text className="text-sm font-bold text-black dark:text-zinc-900 leading-tight">
                IntraTracker UFC
              </Text>
              <Text className="text-[11px] text-gray-500 dark:text-zinc-600 opacity-70">
                Sobral · Tempo Real
              </Text>
            </View>

            <View className="ml-auto flex-row items-center gap-1">
              <View className="w-2 h-2 rounded-full bg-[#4ade80]" />
              <Bell
                size={18}
                color="#10367d"
                onPress={toggleNotificationsModal}
              />
              {isNotificationsModalVisible && (
                <NotificationsModal onClose={toggleNotificationsModal} />
              )}
            </View>
          </View>
        </View>
      </View>
      <View style={{ flex: 1, paddingTop: 0 }}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: "#74b4d9",
            tabBarInactiveTintColor: "#10367d",
            headerShown: false,
            tabBarStyle: {
              backgroundColor: "#fff",
              borderColor: "#e5e7eb",
              paddingTop: 5,
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Home",
              tabBarIcon: ({ color }) => (
                <IconSymbol size={28} name="house.fill" color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="map"
            options={{
              title: "Maps",
              lazy: false,
              tabBarIcon: ({ color }) => (
                <IconSymbol size={28} name="map.fill" color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="schedule"
            options={{
              title: "Horários",
              tabBarIcon: ({ color }) => (
                <IconSymbol size={28} name="clock.fill" color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="info"
            options={{
              title: "Info",
              tabBarIcon: ({ color }) => (
                <IconSymbol size={28} name="info.circle" color={color} />
              ),
            }}
          />
        </Tabs>
      </View>
    </View>
  );
}
