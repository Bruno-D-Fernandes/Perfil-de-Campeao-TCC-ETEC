import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { fetchContacts } from "../services/chat";
import { API_URL } from "@env";

export default function ContatosScreen() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const loadContacts = async () => {
      try {
        setLoading(true);
        const data = await fetchContacts();
        setContacts(data);
      } catch (error) {
        // Tratar erro, talvez mostrar uma mensagem para o usuário
      } finally {
        setLoading(false);
      }
    };

    loadContacts();
  }, []);

  const handleContactPress = (item) => {
    navigation.navigate("Chat", {
      conversationId: item.conversation_id,
      contactName: item.contact.name,
      contactAvatar: item.contact.avatar,
      receiverID: item.contact.id,
      
    });


  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white", padding:10, }}>
      

      <View className="flex-row items-center justify-center" >
      <Pressable className="flex-row bg-[#61D483] w-10 absolute left-1   h-10 rounded-full items-center justify-center p-2 " onPress={() =>  navigation.navigate("MainTabs", { screen: "Oportunidades" })}>
          <Image source={require("../../assets/cadastro/icon_voltar.png")} style={{width:11, height:18, marginRight:5,}}/>
      
      </Pressable>

      <Text style={{ fontSize: 24, fontWeight: "bold", padding: 16, fontFamily: "Poppins_500Medium"}}>
        Conversas
      </Text>
      </View>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.conversation_id.toString()}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleContactPress(item)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: "#eee",
            }}
          >
            {console.log(item)}
            <Image
              source={{
                uri:
                  `${API_URL}/storage/${item.contact.avatar}` ||
                  "https://via.placeholder.com/50",
              }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                marginRight: 16,
              }}
            />
            {console.log(item)}
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: "bold", fontFamily: "Poppins_500Medium" }}>
                {item.contact.name}
              </Text>
              <Text style={{ color: "gray" }}>{item.last_message?.text}</Text>
            </View>
            <Text style={{ color: "gray", fontSize: 12 }}>
              {item.last_message?.time}
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 50 }}>
            Nenhuma conversa encontrada.
          </Text>
        }
      />
    </View>
  );
}
