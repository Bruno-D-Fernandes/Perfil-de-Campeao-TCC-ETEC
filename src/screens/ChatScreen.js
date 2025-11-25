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

export default function ChatScreen() {
  const route = useRoute();
  const { conversationId, contactName, contactAvatar, receiverID } =
    route.params;

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
      } catch (error) {
        console.log("Erro ao carregar mensagens", error);
      } finally {
        setLoading(false);
      }
    };

    if (conversationId) loadMessages();
  }, [conversationId]);

  useEffect(() => {
    if (!pusher || !userId) return;

    const channel = pusher.channel(`private-chat.${userId}`);

    const handleMessage = (data) => {
      console.log("Nova mensagem recebida:", data.message);

      setMessages((prev) => [...prev, data.message]);
    };

    channel.bind("new-message", handleMessage);

    return () => {
      channel.unbind("new-message", handleMessage);
    };
  }, [pusher, userId]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      const response = await api.post(
        "/chat/send",
        {
          receiver_id: receiverID,
          receiver_type: "clube",
          message: text,
        },
        {
          baseURL: `${API_URL}/api`,
        }
      );

      setMessages((prev) => [...prev, response.data]);
      setText("");
    } catch (error) {
      console.log("Erro ao enviar mensagem:", error);
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
        <Image
          source={{
            uri: `${API_URL}/storage/${contactAvatar}`,
          }}
          style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }}
        />
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>{contactName}</Text>
      </View>

      {/* MENSAGENS */}
      <FlatList
        data={messages}
        keyExtractor={(item, index) => (item.id ?? index).toString()}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => {
          if (!item || !item.message) return null;
          const isMe = item.receiver_type === "App\\Models\\Clube";

          if (item.type === "convite") {
            return (
              <View
                style={{
                  marginVertical: 8,
                  padding: 12,
                  backgroundColor: "#4b7bec",
                  borderRadius: 12,
                  maxWidth: "75%",
                  alignSelf:
                    item.sender_id === userId ? "flex-end" : "flex-start",
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Convite: {item.payload.event_name}
                </Text>

                <Text style={{ color: "white" }}>
                  Data: {item.payload.data}
                </Text>

                <Pressable
                  onPress={() => openEvent(item.payload.event_id)}
                  style={{
                    backgroundColor: "white",
                    padding: 8,
                    borderRadius: 8,
                    marginTop: 8,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      color: "#4b7bec",
                    }}
                  >
                    Ver evento
                  </Text>
                </Pressable>
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
                  backgroundColor: isMe ? "#61D483" : "#E5E7EB", // verde / cinza
                  borderBottomRightRadius: isMe ? 2 : 12,
                  borderBottomLeftRadius: isMe ? 12 : 2,
                }}
              >
                <Text
                  style={{
                    color: isMe ? "white" : "black",
                    fontSize: 15,
                  }}
                >
                  {item.message}
                </Text>
              </View>
            </View>
          );
        }}
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
