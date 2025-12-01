import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";
import { useRoute } from "@react-navigation/native";
import { usePusher } from "../context/PusherProvider";
import api from "../services/axios";
import { useNavigation } from "@react-navigation/native";
import { useRef } from "react";

export default function ChatScreen() {
  const route = useRoute();
  const { conversationId, contactName, contactAvatar, receiverID } =
    route.params;
  const flatListRef = useRef(0);

  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const pusher = usePusher();

  useEffect(() => {
    const loadUser = async () => {
      const jsonUser = await AsyncStorage.getItem("user");
      if (jsonUser) {
        setUserId(JSON.parse(jsonUser).id);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await api.get(
          `/conversations/${conversationId}/messages`,
          {
            baseURL: `${API_URL}/api`,
          }
        );
        setMessages(response.data);

        console.log(response.data);
      } catch (error) {
        console.log("Erro ao carregar mensagens", error);
      } finally {
        setLoading(false);
      }
    };

    if (conversationId) loadMessages();
  }, [conversationId]);

  const navigation = useNavigation();

  const aceitoInvite = async (convite_evento_id) => {
    try {
      const response = await api.post(
        "/accept_invite/" + convite_evento_id,
        {},
        {
          baseURL: `${API_URL}/api`,
        }
      );

      if (response.status === 200) navigation.replace("Agenda");

      console.log("Convite aceito:", response.data);
    } catch (error) {
      console.log("Erro ao aceitar convite:", error);
    }
  };

  useEffect(() => {
    if (!pusher || !userId) return;

    const channel = pusher.channel(`private-chat.${userId}`);

    const handleMessage = (data) => {
      console.log("Nova mensagem recebida:", data.message);

      const messageData = data.message;
      // Garante que a mensagem tem um ID único
      if (!messageData.id) {
        messageData.id = `temp-${Date.now()}-${Math.random()}`;
      }

      setMessages((prev) => [...prev, messageData]);
    };

    channel.bind("new-message", handleMessage);

    return () => {
      channel.unbind("new-message", handleMessage);
    };
  }, [pusher, userId]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    const messageText = text;
    setText(""); // Limpa o input imediatamente

    try {
      const response = await api.post(
        "/chat/send",
        {
          receiver_id: receiverID,
          receiver_type: "clube",
          message: messageText,
        },
        {
          baseURL: `${API_URL}/api`,
        }
      );

      // Garante que cada mensagem tem um ID único e estrutura correta
      const messageData = response.data.message || response.data;
      if (!messageData.id) {
        messageData.id = `temp-${Date.now()}-${Math.random()}`;
      }

      // Garante que tem a propriedade 'message'
      if (!messageData.message && messageText) {
        messageData.message = messageText;
      }

      if (!messageData.sender_id && userId) {
        messageData.sender_id = userId;
      }

      console.log("Mensagem enviada:", messageData);
      setMessages((prev) => [...prev, messageData]);
    } catch (error) {
      console.log("Erro ao enviar mensagem:", error);
      setText(messageText);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {/* HEADER */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#ddd",
        }}
      >
        <Pressable
          className="mr-4"
          onPress={() => navigation.navigate("Contatos")}
        >
          <Image
            source={require("../../assets/cadastro/icon_voltar.png")}
            style={{ width: 11, height: 18, tintColor: "grey" }}
          />
        </Pressable>
        <Image
          source={{
            uri: `${API_URL}/storage/${contactAvatar}`,
          }}
          style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }}
        />
        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            fontFamily: "Poppins_500Medium",
          }}
        >
          {contactName}
        </Text>
      </View>

      {/* MENSAGENS */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => (item.id ?? index).toString()}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => {
          if (!item || !item.message) return null;
          const isMe = item.sender_id === userId;

          if (item.type === "convite") {
            console.log("Renderizando convite:", item);

            const inicio = new Date(item.evento?.data_hora_inicio);
            const fim = new Date(item.evento?.data_hora_fim);

            const dataInicio = inicio.toLocaleDateString("pt-BR");
            const dataFim = fim.toLocaleDateString("pt-BR");

            const horaInicio = inicio.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            });
            const horaFim = fim.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <View
                style={{
                  marginVertical: 8,
                  padding: 12,
                  backgroundColor: "#61D483",
                  borderRadius: 12,
                  maxWidth: "75%",
                  alignSelf: "flex-start",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View className="w-60 bg-white p-2 rounded-[12px]">
                  <Text
                    style={{
                      color: "#61D483",
                      fontSize: 20,
                      fontWeight: "bold",
                      borderBottomWidth: 1,
                      borderColor: "#9a9b9c",
                      paddingBottom: 4,
                      fontFamily: "Poppins_500Medium",
                    }}
                  >
                    Convite
                  </Text>
                  <View>
                    <Text
                      style={{
                        color: "#61D483",
                        fontFamily: "Poppins_500Medium",
                      }}
                    >
                      {item.evento?.titulo}
                    </Text>
                  </View>
                  <View className="w-full  flex-row items-center gap-3">
                    <Image
                      source={require("../../assets/cadastro/icon_data.png")}
                      style={{ width: 16, height: 16 }}
                    />
                    <Text
                      style={{
                        color: "",
                        fontFamily: "Poppins_500Medium",
                        marginTop: 5,
                      }}
                    >
                      {dataInicio}
                    </Text>
                  </View>
                  <View className="w-full  flex-row items-center gap-3">
                    <Image
                      source={require("../../assets/cadastro/icon_tempo.png")}
                      style={{ width: 15, height: 16 }}
                    />
                    <Text
                      style={{ color: "", fontFamily: "Poppins_500Medium" }}
                    >
                      às {horaInicio} até às {horaFim}
                    </Text>
                  </View>
                  <View className="w-full  flex-row items-center gap-3">
                    <Image
                      source={require("../../assets/cadastro/icon_local.png")}
                      style={{ width: 13, height: 16 }}
                    />
                    <Text
                      style={{ color: "", fontFamily: "Poppins_500Medium" }}
                    >
                      {item.evento?.cidade}, {item.evento?.bairro}
                    </Text>
                  </View>

                  {item?.convite_evento.status === "aceito" ? (
                    <View
                      style={{
                        backgroundColor: "#4CAF50",
                        padding: 8,
                        borderRadius: 8,
                        marginTop: 12,
                        opacity: 0.8,
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          color: "white",
                          fontFamily: "Poppins_500Medium",
                        }}
                      >
                        Aceito ✓
                      </Text>
                    </View>
                  ) : item?.convite_evento.status === "expirado" ? (
                    <View
                      style={{
                        backgroundColor: "#4CAF50",
                        padding: 8,
                        borderRadius: 8,
                        marginTop: 12,
                        opacity: 0.8,
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          color: "white",
                          fontFamily: "Poppins_500Medium",
                        }}
                      >
                        Convite expirou
                      </Text>
                    </View>
                  ) : (
                    <Pressable
                      onPress={() => aceitoInvite(item?.convite_evento_id)}
                      style={{
                        backgroundColor: "#61D483",
                        padding: 8,
                        borderRadius: 8,
                        marginTop: 12,
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          color: "white",
                          fontFamily: "Poppins_500Medium",
                        }}
                      >
                        Aceitar Convite
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>
            );
          }

          return (
            <View
              style={{
                marginVertical: 6,
                flexDirection: "row",
                justifyContent: isMe ? "flex-end" : "flex-start",
              }}
            >
              <View
                style={{
                  maxWidth: "75%",
                  padding: 10,
                  borderRadius: 12,
                  backgroundColor: isMe ? "#61D48390" : "#E5E7EB",
                  borderBottomRightRadius: isMe ? 2 : 12,
                  borderBottomLeftRadius: isMe ? 12 : 2,
                }}
              >
                <Text
                  style={{
                    color: "black",
                    fontSize: 14,
                    fontFamily: "Poppins_400Regular",
                  }}
                >
                  {item.message}
                </Text>
              </View>
            </View>
          );
        }}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* INPUT */}
      <View
        style={{
          flexDirection: "row",
          padding: 12,
          borderTopWidth: 1,
          borderTopColor: "#ddd",
        }}
      >
        <TextInput
          style={{
            flex: 1,
            backgroundColor: "#f0f0f0",
            padding: 10,
            borderRadius: 8,
          }}
          placeholder="Digite uma mensagem..."
          value={text}
          onChangeText={setText}
        />

        <Pressable
          onPress={sendMessage}
          style={{
            backgroundColor: "#4ADE80",
            paddingHorizontal: 16,
            justifyContent: "center",
            marginLeft: 8,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Enviar</Text>
        </Pressable>
      </View>
    </View>
  );
}
