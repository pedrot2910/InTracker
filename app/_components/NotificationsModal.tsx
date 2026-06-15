import { useState } from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";

export default function NotificationsModal({ onClose }) {
  const [notificationsList, setNotificationsList] = useState([
    {
      id: "1",
      title: "Nova atualização",
      message: "O aplicativo foi atualizado para a versão 2.0.",
    },
    {
      id: "2",
      title: "Está se aproximando!",
      message: "O ônibus está se aproximando da Famed",
    },
  ]);

  return (
    <Modal
      visible={true}
      animationType="fade"
      onRequestClose={onClose}
      transparent={true}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Fundo com transparência
        }}
      >
        {/* Modal Content */}
        <View
          style={{
            backgroundColor: "#fff",
            width: "90%", // Modal ocupa 90% da largura da tela
            maxWidth: 400, // Largura máxima do modal
            borderRadius: 10, // Bordas arredondadas
            padding: 20, // Padding interno
            shadowColor: "#000", // Sombra suave
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 10, // Para sombra no Android
          }}
        >
          {/* Título do Modal */}
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#333",
              marginBottom: 15,
              textAlign: "center", // Centraliza o título
            }}
          >
            Notificações
          </Text>

          {/* Lista de Notificações */}
          <FlatList
            data={notificationsList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={{
                  backgroundColor: "#f0f4f8",
                  padding: 15,
                  marginBottom: 10,
                  borderRadius: 8,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 16,
                    color: "#1E2A3A",
                    marginBottom: 5,
                  }}
                >
                  {item.title}
                </Text>
                <Text style={{ color: "#7E8B99", fontSize: 14 }}>
                  {item.message}
                </Text>
              </View>
            )}
          />

          {/* Botão de Fechar */}
          <TouchableOpacity
            style={{
              backgroundColor: "#10367d",
              paddingVertical: 12,
              paddingHorizontal: 30,
              borderRadius: 50,
              marginTop: 15,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.2,
              shadowRadius: 6,
              elevation: 5,
            }}
            onPress={onClose}
          >
            <Text style={{ color: "#fff", fontSize: 16 }}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
