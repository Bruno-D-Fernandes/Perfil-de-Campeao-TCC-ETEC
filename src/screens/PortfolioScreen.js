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

  const icon1 = useSharedValue(40); // Lixeira
  const icon2 = useSharedValue(40); // Edição
  const icon3 = useSharedValue(40); // Postagem
  const iconHeight = useSharedValue(10);

  const styleIcon1 = useAnimatedStyle(() => ({
    bottom: icon1.value,
    right: 15,
    height: iconHeight.value,
    width: iconHeight.value,
    zIndex: 1,
  }));

  const styleIcon2 = useAnimatedStyle(() => ({
    bottom: icon2.value + 50,
    right: icon2.value - 20,
    height: iconHeight.value,
    width: iconHeight.value,
    zIndex: 1,
  }));

  const styleIcon3 = useAnimatedStyle(() => ({
    right: icon3.value,
    bottom: 80,
    height: iconHeight.value,
    width: iconHeight.value,
    zIndex: 1,
  }));

  const popIn = () => {
    setPop(true);
    icon1.value = withSpring(190);
    icon2.value = withSpring(110);
    icon3.value = withSpring(120);
    iconHeight.value = withSpring(56);
  };

  const popOut = () => {
    setPop(false);
    icon1.value = withTiming(40, { duration: 200 });
    icon2.value = withTiming(40, { duration: 200 });
    icon3.value = withTiming(40, { duration: 200 });
    iconHeight.value = withTiming(10, { duration: 200 });
  };

  const fetchUserPosts = async (esporteId) => {
    setLoading(true);
    try {
      const userData = await AsyncStorage.getItem("user");
      let userId = JSON.parse(userData);
      userId = userId.id;

      // Passa o ID do esporte para a função de busca
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
      // Seleciona o ID do primeiro esporte para carregar as postagens iniciais
      const primeiroEsporteId = Object.values(perfis).flat()[0]?.esporte_id;
      setSelectedEsporte(primeiroEsporteId);
    }
  }, [perfis]);

  useEffect(() => {
    if (selectedEsporte) {
      fetchUserPosts(selectedEsporte);
    }
  }, [selectedEsporte]);

  // Função para abrir o modal de ações
  const openActionModal = (postagem) => {
    setSelectedPostagem(postagem);
    setIsActionModalVisible(true);
    popOut(); // Fecha os botões animados se estiverem abertos
  };

  // Função para fechar o modal de ações
  const closeActionModal = () => {
    setIsActionModalVisible(false);
    setSelectedPostagem(null);
  };

  // Função para recarregar as postagens após uma ação (update/delete)
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
      {/* BOTÕES ANIMADOS - Modificados para abrir o modal de ações */}
      {/* O botão de Lixeira e Edição agora não são mais necessários aqui, pois a ação será feita no item da lista ou no botão principal de postagem */}
      {/* Mantendo o botão de Nova Postagem e o botão principal */}

      {/* Botão de Nova Postagem (Icon3) - Mantido para navegação para a tela de criação */}
      <Animated.View
        style={styleIcon3}
        className="bg-green-500 absolute rounded-full justify-center items-center"
      >
        <Pressable onPress={() => console.log(" Navegar para Nova postagem")}>
          <Icon name="plus" size={25} color="#FFF" />
        </Pressable>
      </Animated.View>

      {/* BOTÃO PRINCIPAL - Mantido para abrir/fechar o menu de ações (se necessário) ou para a nova postagem */}
      <Pressable
        className="bg-green-500 w-14 h-14 absolute bottom-10 mb-10 right-5 rounded-full justify-center items-center"
        style={{ zIndex: 1 }}
        onPress={() => (pop ? popOut() : popIn())}
      >
        <Icon name="plus" size={25} color="#FFF" />
      </Pressable>

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
                  <Text className="font-bold text-lg mb-1 text-gray-800">
                    {item.usuario?.name || "Usuário"}
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
