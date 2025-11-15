import { View, Text, TextInput, FlatList, Image, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function ChatConversation({ user, onClose, onNewMessage }) {
  
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (user?.lastMessage) {
      setMessages([
        {
          id: "initial",
          text: user.lastMessage,
          sender: "other",
          time: user.time,
        },
      ]);
    }
  }, [user]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const time = `${hours}:${minutes}`;

    const newMsg = {
      id: Date.now().toString(),
      text: input,
      sender: "me",
      time,
    };

    setMessages((prev) => [...prev, newMsg]);

    onNewMessage({ text: input, time });

    setInput("");
  };

  return (
    <View className="flex-1 bg-white">

      <View className="flex-row items-center justify-between gap-3 px-4 py-3 border-b border-gray-200">
        <Pressable onPress={onClose} className="bg-[#61D483] w-12 h-12 items-center justify-center rounded-full">
            <Image source={require("../../assets/icons/icon_voltar.png")} style={{marginRight:4,}} />
        </Pressable>

        <View className="flex-row gap-2">
            <Image
            source={user?.image }
            className="w-10 h-10 rounded-full"
            />

            <View className="">
                <Text className="text-lg " style={{fontFamily:'Poppins_500MEdium',}}>{user?.name}</Text>
                <Text className="text-xs text-gray-500">online</Text>
            </View>
        </View>

        <Pressable className='gap-1'>
            <View className='bg-[#61D483] p-1 rounded-full'/>
            <View className='bg-[#61D483] p-1 rounded-full'/>
            <View className='bg-[#61D483] p-1 rounded-full'/>
        </Pressable>
      </View>



      <FlatList
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ paddingVertical: 10 }}
        renderItem={({ item }) => {
          const eu = item.sender === "me";

          return (
          <View
  className={`w-full px-3 my-1 flex-row ${
    eu ? "justify-end" : "justify-start"
  }`}
>
  <View
    className={`max-w-[75%] px-4 py-2 rounded-[10px] relative ${
      eu ? "bg-green-500" : "bg-gray-200"
    }`}
  >
 

     <Text
        style={{fontFamily:'Poppins_500Medium', fontSize:16,}} 
        className={`text-base ${eu ? 'text-white' : 'text-gray-800'}`}
        >
          {item.text}
        </Text>
        
        <View 
          className={`flex flex-row justify-end mt-1`}
        >
          <Text 
            style={{fontFamily:'Poppins_500Medium', fontSize:13,}}
            className={` ${eu ? 'text-white' : 'text-gray-500'}`}
          >
            {item.time}
          </Text>
  </View>
  </View>
</View>


          );
        }}
      />

      <View className="flex-row items-center px-3 py-2 border-t border-gray-200 bg-white">
        <TextInput
          placeholder="Mensagem..."
          value={input}
          onChangeText={setInput}
          className="flex-1 bg-gray-100 px-4 py-2 rounded-full mr-2"
        />

        <Pressable
          onPress={sendMessage}
          className="bg-green-500 p-3 rounded-full"
        >
          <Ionicons name="send-outline" size={20} color="#fff" />
        </Pressable>
      </View>

    </View>
  );
}
