import {
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import usuario from "./../../services/usuario"; // sua API

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState("info");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para calcular idade
  const calcularIdade = (dataNascimento) => {
    if (!dataNascimento) return null;
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  };

  const loadUserData = async () => {
    try {
      setLoading(true);
      const response = await usuario.splashUser();
      setUserData(response.data);
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
        <Pressable
          onPress={loadUserData}
          className="mt-4 bg-green-500 px-4 py-2 rounded-xl"
        >
          <Text className="text-white">Tentar Novamente</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Banner */}
      <ImageBackground
        source={{
          uri:
            userData?.fotoBannerUsuario ||
            "https://picsum.photos/800/400",
        }}
        className="w-full h-40"
      >
        <TouchableOpacity
          style={tw`absolute right-4 top-4 bg-white p-2 rounded-full shadow`}
        >
          <Ionicons name="settings" size={22} color="green" />
        </TouchableOpacity>
      </ImageBackground>

      {/* Foto de Perfil + Nome */}
      <View className="items-center -mt-12">
        <Image
          source={{
            uri:
              userData?.fotoPerfilUsuario ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          }}
          className="w-24 h-24 rounded-full border-4 border-white"
        />
        <Text className="text-xl font-bold text-gray-800 mt-2">
          {userData?.nomeUsuario || "Usuário"}
        </Text>
        <Ionicons name="medal-outline" size={20} color="gray" />
      </View>

      {/* Tabs */}
      <View className="flex-row justify-center mt-4 border-b border-gray-200">
        <Pressable
          className={`px-6 pb-2 ${
            activeTab === "feed" ? "border-b-2 border-green-500" : ""
          }`}
          onPress={() => setActiveTab("feed")}
        >
          <Text
            className={`text-base ${
              activeTab === "feed"
                ? "text-green-600 font-bold"
                : "text-gray-500"
            }`}
          >
            Feed
          </Text>
        </Pressable>

        <Pressable
          className={`px-6 pb-2 ${
            activeTab === "info" ? "border-b-2 border-green-500" : ""
          }`}
          onPress={() => setActiveTab("info")}
        >
          <Text
            className={`text-base ${
              activeTab === "info"
                ? "text-green-600 font-bold"
                : "text-gray-500"
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
              {userData?.generoUsuario && (
                <Pressable className="bg-green-100 w-[48%] rounded-xl p-4 mb-3">
                  <Ionicons name="male-female-outline" size={18} color="green" />
                  <Text className="text-gray-600 text-sm">Gênero</Text>
                  <Text className="text-green-600 font-bold">
                    {userData.generoUsuario}
                  </Text>
                </Pressable>
              )}

              {userData?.dataNascimentoUsuario && (
                <Pressable className="bg-green-100 w-[48%] rounded-xl p-4 mb-3">
                  <Ionicons name="calendar-outline" size={18} color="green" />
                  <Text className="text-gray-600 text-sm">Idade</Text>
                  <Text className="text-green-600 font-bold">
                    {calcularIdade(userData.dataNascimentoUsuario)} anos
                  </Text>
                </Pressable>
              )}

              {userData?.alturaCm && (
                <Pressable className="bg-green-100 w-[48%] rounded-xl p-4 mb-3">
                  <Ionicons name="resize-outline" size={18} color="green" />
                  <Text className="text-gray-600 text-sm">Altura</Text>
                  <Text className="text-green-600 font-bold">
                    {userData.alturaCm} cm
                  </Text>
                </Pressable>
              )}

              {userData?.pesoKg && (
                <Pressable className="bg-green-100 w-[48%] rounded-xl p-4 mb-3">
                  <Ionicons name="barbell-outline" size={18} color="green" />
                  <Text className="text-gray-600 text-sm">Peso</Text>
                  <Text className="text-green-600 font-bold">
                    {userData.pesoKg} kg
                  </Text>
                </Pressable>
              )}
            </View>

            {/* Cards maiores */}
            <Pressable className="bg-green-200 rounded-xl p-4 mb-3 flex-row items-center">
              <Ionicons name="time-outline" size={20} color="green" />
              <Text className="text-green-700 font-bold ml-2">Histórico</Text>
            </Pressable>

            <Pressable className="bg-green-200 rounded-xl p-4 mb-3 flex-row items-center">
              <Ionicons name="star-outline" size={20} color="green" />
              <Text className="text-green-700 font-bold ml-2">Habilidades</Text>
            </Pressable>

            <Pressable className="bg-green-200 rounded-xl p-4 mb-3 flex-row items-center">
              <Ionicons name="stats-chart-outline" size={20} color="green" />
              <Text className="text-green-700 font-bold ml-2">Estatísticas</Text>
            </Pressable>

            <Pressable className="bg-green-400 rounded-xl p-4 mb-3 flex-row items-center">
              <Ionicons name="trophy-outline" size={20} color="white" />
              <Text className="text-white font-bold ml-2">
                Troféus e Medalhas
              </Text>
            </Pressable>
          </View>
        ) : (
          <Text className="text-center text-gray-500">
            Feed em construção...
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
