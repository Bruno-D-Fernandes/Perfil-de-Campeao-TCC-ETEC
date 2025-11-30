import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  Pressable,
  Linking,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import api from "../services/axios";
import { useRoute, useNavigation } from "@react-navigation/native";
import { API_URL } from "@env";

const windowWidth = Dimensions.get("window").width;
const HEADER_HEIGHT = 180;

export default function PerfilClubeScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { idClube } = route.params;

  const [dataClube, setDataClube] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchClube() {
      try {
        const response = await api.get(`/clube/${idClube}`);
        setDataClube(response.data);
      } catch (err) {
        setError("Erro ao carregar os dados do clube.");
      } finally {
        setLoading(false);
      }
    }
    fetchClube();
  }, [idClube]);

  function formatDate(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}/${d.getFullYear()}`;
  }

  const handleEmailPress = () => {
    if (dataClube?.emailClube) {
      Linking.openURL(`mailto:${dataClube.emailClube}`);
    }
  };

  if (loading)
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );

  if (error)
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text>{error}</Text>
      </View>
    );

  if (!dataClube)
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text>Clube não encontrado.</Text>
      </View>
    );

  return (
    <View className="flex-1 bg-gray-100">
      <View
        className="absolute top-0 w-full bg-green-400"
        style={{ height: HEADER_HEIGHT }}
      />

      <SafeAreaView className="absolute top-4 left-0 right-0 z-10 flex-row justify-between px-5">
        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-white/20 justify-center items-center"
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require("../../assets/cadastro/icon_voltar.png")}
            style={{ width: 14, height: 22, marginRight: 4 }}
          />
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View
          className="mx-4 bg-white rounded-2xl p-6 shadow-lg"
          style={{ marginTop: HEADER_HEIGHT - 60 }}
        >
          <View className="items-center mb-6">
            <Image
              source={
                dataClube?.fotoPerfilClube
                  ? {
                      uri: `${API_URL}/storage/${dataClube.fotoPerfilClube}`,
                    }
                  : require("../../assets/perfil/fotoPerfil.png")
              }
              className="w-24 h-24 rounded-full mb-2 border-4 border-white bg-white"
              style={{ marginTop: -70 }}
            />

            <Text className="text-xl font-semibold text-gray-800">
              {dataClube?.nomeClube ?? "Nome do Clube"}
            </Text>

            <Pressable onPress={handleEmailPress} className="mt-1">
              <Text className="text-sm text-green-600">
                {dataClube?.emailClube ?? "email@clube.com"}
              </Text>
            </Pressable>
          </View>

          <View className="bg-gray-100 p-4 rounded-xl mb-3">
            <Text className="text-xs text-gray-500 mb-1">Sobre o Clube (Bio)</Text>
            <Text className="text-gray-700">
              {dataClube?.bioClube ?? "Bio não informada."}
            </Text>
          </View>

          <View className="bg-gray-100 p-4 rounded-xl mb-3">
            <Text className="text-xs text-gray-500 mb-1">Endereço Completo</Text>
            <Text className="text-gray-700">
              {dataClube?.enderecoClube ?? "Não informado"}
            </Text>
          </View>

          <View className="flex-row flex-wrap justify-between mt-6 mb-2">
            <View
              className="rounded-xl p-4 mb-2"
              style={{
                width: (windowWidth - 82) / 2,
                backgroundColor: "#61D48330",
              }}
            >
              <View className="flex-row justify-between items-center mb-2">
                <View className="w-8 h-8 bg-white rounded-full items-center justify-center">
                  <Image
                    source={require("../../assets/cadastro/icon_data.png")}
                    style={{ width: 16, height: 16 }}
                  />
                </View>
              </View>
              <Text className="text-lg font-bold text-gray-800">
                {formatDate(dataClube?.anoCriacaoClube) ?? "-"}
              </Text>
              <Text className="text-xs text-gray-500 mt-1">Fundado</Text>
            </View>

            <View
              className="rounded-xl p-4 mb-2"
              style={{
                width: (windowWidth - 82) / 2,
                backgroundColor: "#61D48330",
              }}
            >
              <View className="flex-row justify-between items-center mb-2">
                <View className="w-8 h-8 bg-white rounded-full items-center justify-center">
                  <Image
                    source={require("../../assets/cadastro/icon_posicao.png")}
                    style={{ width: 16, height: 20 }}
                  />
                </View>
              </View>

              <Text className="text-lg font-bold text-gray-800">
                {dataClube?.categoria?.nomeCategoria ?? "-"}
              </Text>

              <Text className="text-xs text-gray-500 mt-1">Categoria</Text>
            </View>

            <View
              className="rounded-xl p-4 mb-5 w-full"
              style={{
                backgroundColor: "#61D48330",
              }}
            >
              <View className="flex-row justify-between items-center mb-2">
                <View className="w-8 h-8 bg-white rounded-full items-center justify-center">
                  <Image
                    source={require("../../assets/cadastro/icon_esporte.png")}
                    style={{ width: 18, height: 14 }}
                  />
                </View>
              </View>
              <Text className="text-lg font-bold text-gray-800">
                {dataClube?.esporte?.nomeEsporte ?? "-"}
              </Text>
              <Text className="text-xs text-gray-500 mt-1">Esporte</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
