import { View, Text, Image, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import usuario from "../../services/usuario" 
import axios from "axios";

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState("info");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const response = await usuario.splashUser();
      setUserData(response.data); // resposta da API
      setError(null);
    } catch (err) {
      setError("Erro ao carregar dados do usuário");
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-red-500">{error}</Text>
        <Pressable onPress={loadUserData} className="mt-4 bg-green-500 px-4 py-2 rounded-xl">
          <Text className="text-white">Tentar Novamente</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header com capa e avatar */}
      <View>
        <Image
          source={{ uri: "https://picsum.photos//300" }} // imagem de capa fake
          className="w-full h-32"
        />
        <View className="items-center -mt-12">
          {userData?.foto ? (
            <Image
              source={{ uri: userData.foto }}
              className="w-24 h-24 rounded-full border-4 border-white"
            />
          ) : (
            <View className="w-24 h-24 rounded-full border-4 border-white bg-green-100 items-center justify-center">
              <Text className="text-3xl font-bold text-green-700">
                {userData?.nome?.charAt(0) || "U"}
              </Text>
            </View>
          )}

          {/* Botão config */}
          <Pressable
            style={tw`absolute right-4 top-13 bg-white p-2 rounded-full shadow`}
            >
            <Ionicons name="settings" size={22} color="green" />
          </Pressable>
        </View>
      </View>

      {/* Nome e medalha */}
      <View className="items-center mt-2">
        <Text className="text-2xl font-bold text-gray-800">
          {userData?.nome || "Usuário"}
        </Text>
        <Ionicons name="medal-outline" size={20} color="gray" />
      </View>

      {/* Tabs */}
      <View className="flex-row justify-center mt-4 border-b border-gray-200">
        <Pressable
          className={`px-6 pb-2 ${activeTab === "feed" ? "border-b-2 border-green-500" : ""}`}
          onPress={() => setActiveTab("feed")}
        >
          <Text
            className={`text-base ${
              activeTab === "feed" ? "text-green-600 font-bold" : "text-gray-500"
            }`}
          >
            Feed
          </Text>
        </Pressable>

        <Pressable
          className={`px-6 pb-2 ${activeTab === "info" ? "border-b-2 border-green-500" : ""}`}
          onPress={() => setActiveTab("info")}
        >
          <Text
            className={`text-base ${
              activeTab === "info" ? "text-green-600 font-bold" : "text-gray-500"
            }`}
          >
            Informações
          </Text>
        </Pressable>
      </View>

      {/* Conteúdo das Tabs */}
      <ScrollView className="flex-1 px-4 py-4">
        {activeTab === "info" ? (
          <View>
            {/* Grid de informações */}
            <View className="flex-row flex-wrap justify-between">
              {userData?.genero && (
                <View className="bg-green-100 w-[48%] rounded-xl p-4 mb-3">
                  <Text className="text-gray-600 text-sm">Gênero</Text>
                  <Text className="text-green-600 font-bold">{userData.genero}</Text>
                </View>
              )}

              {userData?.idade && (
                <View className="bg-green-100 w-[48%] rounded-xl p-4 mb-3">
                  <Text className="text-gray-600 text-sm">Idade</Text>
                  <Text className="text-green-600 font-bold">{userData.idade} anos</Text>
                </View>
              )}

              {userData?.altura && (
                <View className="bg-green-100 w-[48%] rounded-xl p-4 mb-3">
                  <Text className="text-gray-600 text-sm">Altura</Text>
                  <Text className="text-green-600 font-bold">{userData.altura}</Text>
                </View>
              )}

              {userData?.peso && (
                <View className="bg-green-100 w-[48%] rounded-xl p-4 mb-3">
                  <Text className="text-gray-600 text-sm">Peso</Text>
                  <Text className="text-green-600 font-bold">{userData.peso}</Text>
                </View>
              )}
            </View>

            {/* Cards maiores */}
            <Pressable className="bg-green-200 rounded-xl p-4 mb-3">
              <Text className="text-green-700 font-bold">Histórico</Text>
            </Pressable>
            <Pressable className="bg-green-200 rounded-xl p-4 mb-3">
              <Text className="text-green-700 font-bold">Habilidades</Text>
            </Pressable>
            <Pressable className="bg-green-200 rounded-xl p-4 mb-3">
              <Text className="text-green-700 font-bold">Estatísticas</Text>
            </Pressable>
            <Pressable className="bg-green-400 rounded-xl p-4 mb-3">
              <Text className="text-white font-bold">Troféus e Medalhas</Text>
            </Pressable>
          </View>
        ) : (
          <Text className="text-center text-gray-500">Aqui ficaria o Feed...</Text>
        )}
      </ScrollView>
    </View>
  );
}
