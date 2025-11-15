import { View, Text, FlatList, Image, Pressable, Modal, TextInput } from "react-native";
import React, { useState } from "react";
import ChatConversation from "./../components/ChatConversation";

export default function ChatScreen() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBtn, setSelectedBtn] = useState("Todas");

  const btns = ["Todas", "Não lidas"];



  const [contacts, setContacts] = useState([
    {
      id: "1",
      name: "Junior",
      lastMessage: "é n tem mais oq fazer",
      time: "21:07",
      image: require("../../assets/post/perfilFoto.png"),
    },
    {
      id: "2",
      name: "Aline",
      lastMessage: "Sem fabrica",
      time: "21:07",
      image: require("../../assets/post/perfilFoto.png"),
    },
    {
      id: "3",
      name: "Lulu",
      lastMessage: "ta feio jovem",
      time: "21:07",
      image: require("../../assets/post/perfilFoto.png"),
    },
  ]);

  const updateLastMessage = (userId, { text, time }) => {
    setContacts((prev) =>
      prev.map((c) =>
        c.id === userId
          ? { ...c, lastMessage: text, time }
          : c
      )
    );
  };

  const openConversation = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  return (
    <View className="flex-1 p-4 bg-white">

      <View className="gap-4 mb-4">

        <Text className="text-2xl font-bold ">Conversas</Text>

        <View className="h-[50px] w-[100%] rounded-full bg-[#EFEFEF] gap-4 flex-row items-center">
          <Image
            source={require("../../assets/icons/pesquisa.png")}
            style={{ width: "22px", height: "22px", marginLeft: 15 }}
          />
          <TextInput
            className="color-gray-600 font-normal w-[80%] h-[90%]"
            style={{ fontFamily: "Poppins_400Regular" }}
            placeholder="Pesquisar..."
          />
        </View>

        <View className="flex-row items-center gap-4">
          {btns.map((btn) => {
            const isSelected = selectedBtn === btn;
              return (
                <Pressable
                  key={btn}
                  onPress={() => setSelectedBtn(btn)}
                  className={`items-center justify-center px-6 h-[37px] rounded-full ${
                    isSelected ? "bg-[#61D483] border-[2px] border-[#61D483]" : "border-[2px] border-[#61D483]"
                  }`}
                >
                  <Text className={`${isSelected ? "text-white" : "text-[#61D483]"}`} style={{fontFamily:'Poppins_500Medium'}}>
                    {btn}
                  </Text>
                </Pressable>
              );
            })}
        </View>

      </View>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => openConversation(item)}
            className="flex-row items-center px-4 py-3 border-b border-gray-200"
          >
            <Image
              source={ item.image }
              className="w-12 h-12 rounded-full mr-4"
            />

            <View className="flex-1">
              <Text className="text-lg " style={{fontFamily:"Poppins_500Medium",}}>{item.name}</Text>
              <Text className="text-gray-500" style={{fontFamily:"Poppins_500Medium",}}>{item.lastMessage}</Text>
            </View>

            <Text className="text-[#61D483] text-sm" style={{fontFamily:"Poppins_500Medium",}}>{item.time}</Text>
          </Pressable>
        )}
      />

      <Modal visible={modalVisible} animationType="slide">
        <ChatConversation
          user={selectedUser}
          onClose={() => setModalVisible(false)}
          onNewMessage={(msg) => updateLastMessage(selectedUser.id, msg)}
        />
      </Modal>

    </View>
  );
}
