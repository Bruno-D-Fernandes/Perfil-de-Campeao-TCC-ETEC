import React, { useEffect, useState } from "react";
import {
  View,
  Pressable,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { getPostagensPorUsuario } from "../../services/postagem";

import tw from "twrnc";

import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

import usuario from "./../../services/usuario";
import { loadPerfilAll } from "./../../services/perfil";
// import { postagemData } from "./../../services/postagem"; // Não é necessário aqui

// IMPORTAÇÃO DO NOVO COMPONENTE DE MODAL
import PortfolioActionModal from "../components/portfolioComponents/PortfolioActionModal";

export default function PrtifolioScreen() {
  const [perfilMain, setPerfilMain] = useState({});
  const [pop, setPop] = useState(false);
  const [postagens, setPostagens] = useState([]);

  const [loading, setLoading] = useState(true);
  const [selectedEsporte, setSelectedEsporte] = useState(null);
  const [perfis, setPerfis] = useState([]);

  // Estados para o Modal de Ações
  const [isActionModalVisible, setIsActionModalVisible] = useState(false);
  const [selectedPostagem, setSelectedPostagem] = useState(null);

  const fetchUserPosts = async (esporteId) => {
    setLoading(true);
    try {
      const userData = await AsyncStorage.getItem("user");
      let userId = JSON.parse(userData);
      userId = userId.id;

      const data = await getPostagensPorUsuario(userId, esporteId);
      setPostagens(data);
    } catch (error) {
      console.error("Erro ao buscar postagens do usuário:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async () => {
    try {
      const response = await usuario.splashUser();
      const responsePerfil = await loadPerfilAll();
      setPerfis(responsePerfil);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (perfis && Object.keys(perfis).length > 0 && !selectedEsporte) {
      const primeiroEsporteId = Object.values(perfis).flat()[0]?.esporte_id;
      setSelectedEsporte(primeiroEsporteId);
    }
  }, [perfis]);

  useEffect(() => {
    if (selectedEsporte) {
      fetchUserPosts(selectedEsporte);
    }
  }, [selectedEsporte]);

  const openActionModal = (postagem) => {
    setSelectedPostagem(postagem);
    setIsActionModalVisible(true);
    popOut(); // Fecha os botões animados se estiverem abertos
  };

  const closeActionModal = () => {
    setIsActionModalVisible(false);
    setSelectedPostagem(null);
  };

  const handleSuccessAction = () => {
    fetchUserPosts(selectedEsporte);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#49D372" />
        <Text className="mt-2 text-gray-500">Carregando postagens...</Text>
      </View>
    );
  }
  return (
    <View className="flex-1 bg-white">
      {/* Picker para o esporte */}
      <View style={tw`w-full justify-end rounded-t-5`}>
        <Picker
          style={tw`w-full px-4 h-12 border-none bg-red-200 rounded-t-5`}
          selectedValue={selectedEsporte}
          onValueChange={(value) => setSelectedEsporte(value)}
        >
          {Object.entries(perfis).map(([nomeEsporte, listaDePerfis]) => (
            <Picker.Item
              key={listaDePerfis[0].esporte.id}
              label={nomeEsporte}
              value={listaDePerfis[0].esporte.id}
            />
          ))}
        </Picker>
      </View>

      {/* FEED DE POSTAGENS */}
      {postagens.length === 0 ? (
        <Text className="text-center text-gray-500 mt-10">
          Nenhuma postagem encontrada.
        </Text>
      ) : (
        <FlatList
          data={postagens}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View className="mb-4 bg-gray-100 p-4 rounded-xl shadow-sm mx-4 mt-2">
              <View style={tw`flex-row justify-between items-start`}>
                <View>
                  <Text className="font-bold text-[17px] mb-1 text-gray-800">
                    {item.usuario?.nomeCompletoUsuario || "Usuário"}
                  </Text>
                  <Text className="text-gray-700">{item.textoPostagem}</Text>
                </View>
                {/* Botão de Ações (Update/Delete) no item da lista */}
                <Pressable
                  onPress={() => openActionModal(item)}
                  style={tw`p-2`}
                >
                  <Icon name="ellipsis-v" size={20} color="#374151" />
                </Pressable>
              </View>

              {item.imagens && item.imagens.length > 0 ? (
                <Image
                  source={{
                    uri: `http://127.0.0.1:8000/storage/${item.imagens[0].caminhoImagem}`,
                  }}
                  className="w-full h-48 mt-2 rounded-lg"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-48 mt-2 bg-gray-300 rounded-lg justify-center items-center">
                  <Text className="text-gray-500">Sem imagem</Text>
                </View>
              )}
            </View>
          )}
        />
      )}

      {/* O NOVO MODAL DE AÇÕES */}
      {selectedPostagem && (
        <PortfolioActionModal
          isVisible={isActionModalVisible}
          onClose={closeActionModal}
          postagem={selectedPostagem}
          onSuccess={handleSuccessAction}
        />
      )}
    </View>
  );
}
