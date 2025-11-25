import React, { useEffect, useState } from "react";
import {
  View,
  Pressable,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tw from "twrnc";
import { API_URL } from "@env";
import { getPostagensPorUsuario } from "../services/postagem";
import usuario from "../services/usuario";
import { loadPerfilAll } from "../services/perfil";
import FloatingOptionsModal from "../components/portfolioComponents/FloatingOptionsModal";
import PortfolioActionModal from "../components/portfolioComponents/PortfolioActionModal";
// Importação necessária para vídeos
import { Video } from "expo-av";

// Função auxiliar para verificar se a URI é de um vídeo
const isVideo = (uri) => {
  if (!uri) return false;
  const lowerCaseUri = uri.toLowerCase();
  return (
    lowerCaseUri.endsWith(".mp4") ||
    lowerCaseUri.endsWith(".mov") ||
    lowerCaseUri.endsWith(".avi") ||
    lowerCaseUri.endsWith(".webm")
  );
};

// Componente para renderizar a mídia (Imagem ou Vídeo)
const PostMedia = ({ mediaPath }) => {
  const uri = `${API_URL}/storage/${mediaPath}`;

  if (isVideo(uri)) {
    return (
      <Video
        source={{ uri }}
        style={[
          tw`w-full h-48 rounded-2xl mb-3`,
          { backgroundColor: "#000" }, // Adiciona um fundo preto para o vídeo
        ]}
        useNativeControls
        resizeMode="cover"
        isLooping={false}
      />
    );
  }

  return (
    <Image
      source={{ uri }}
      style={[tw`w-full h-48 rounded-2xl mb-3`, { tintColor: undefined }]}
      resizeMode="cover"
    />
  );
};

export default function PortifolioScreen() {
  const [perfilMain, setPerfilMain] = useState({});
  const [postagens, setPostagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEsporte, setSelectedEsporte] = useState(null);
  const [perfis, setPerfis] = useState([]);

  // Estados dos modais
  const [showFloatingModal, setShowFloatingModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedPostagem, setSelectedPostagem] = useState(null);
  const [modalPos, setModalPos] = useState({ top: 0, left: 0 });
  const [modalMode, setModalMode] = useState("edit");

  const handleCloseAll = () => {
    setShowFloatingModal(false);
    setShowActionModal(false);
    setSelectedPostagem(null);
    setModalMode("edit");
  };

  const fetchUserPosts = async (esporteId) => {
    setLoading(true);
    try {
      const userData = await AsyncStorage.getItem("user");
      const userId = JSON.parse(userData).id;
      const data = await getPostagensPorUsuario(userId, esporteId);
      setPostagens(data);
    } catch (error) {
      console.error("Erro ao buscar postagens:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async () => {
    try {
      await usuario.splashUser();
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
      const primeiro = Object.values(perfis).flat()[0];
      const primeiroEsporteId =
        primeiro?.esporte?.id ?? primeiro?.esporte_id ?? null;
      if (primeiroEsporteId != null) setSelectedEsporte(primeiroEsporteId);
    }
  }, [perfis]);

  useEffect(() => {
    if (selectedEsporte) {
      fetchUserPosts(selectedEsporte);
    }
  }, [selectedEsporte]);

  const handleOpenOptions = (event, postagem) => {
    const { pageY, pageX } = event.nativeEvent;
    setModalPos({ top: pageY - 80, left: pageX - 120 });
    setSelectedPostagem(postagem);
    setShowFloatingModal(true);
  };

  const handleOpenActionModal = (action) => {
    setShowFloatingModal(false);
    setModalMode(action);
    setShowActionModal(true);
  };

  const handleCloseActionModal = () => {
    setShowActionModal(false);
    setSelectedPostagem(null);
    setModalMode("edit");
  };

  const handleSuccessAction = () => {
    fetchUserPosts(selectedEsporte);
    handleCloseAll();
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <View className="p-4">
        <Text style={{ fontFamily: "Poppins_500Medium", fontSize: 30 }}>
          Portfólio
        </Text>
        <Text
          style={{
            fontFamily: "Poppins_500Medium",
            fontSize: 18,
            color: "#2e7844",
          }}
        >
          Minhas postagens
        </Text>
      </View>
      <View className="w-[50%] bg-[#61D48340] rounded-[30px] p-2 m-3">
        <Picker
          selectedValue={selectedEsporte}
          onValueChange={(value) => setSelectedEsporte(value)}
          style={{
            backgroundColor: "#61D48300",
            width: "100%",
            color: "#2E7844",
            fontFamily: "Poppins_500Medium",
            borderRadius: 5,
          }}
        >
          {Object.entries(perfis).map(([nomeEsporte, listaDePerfis]) => {
            const id =
              listaDePerfis?.[0]?.esporte?.id ?? listaDePerfis?.[0]?.esporte_id;
            return (
              <Picker.Item
                key={id ?? nomeEsporte}
                label={nomeEsporte}
                value={id}
              />
            );
          })}
        </Picker>
      </View>

      {loading ? (
        <View style={tw`flex-1 items-center justify-center mt-8`}>
          <ActivityIndicator size="large" color="#49D372" />
          <Text style={tw`mt-2 text-gray-500`}>Carregando postagens...</Text>
        </View>
      ) : postagens.length === 0 ? (
        <Text style={tw`text-center text-gray-500 mt-10`}>
          Nenhuma postagem encontrada.
        </Text>
      ) : (
        <FlatList
          data={postagens}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View
              style={tw`bg-white mx-4 my-3 p-4 rounded-3xl border border-[#49D372] shadow-sm`}
            >
              <View style={tw`gap-3 mb-3`}>
                <View style={tw`flex-row items-center`}>
                  <Image
                    source={{
                      uri: item.usuario?.fotoPerfilUsuario
                        ? `${API_URL}/storage/${item.usuario.fotoPerfilUsuario}`
                        : "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                    }}
                    style={tw`w-10 h-10 rounded-full mr-2`}
                  />

                  <Text style={tw`text-gray-800 font-semibold text-[16px]`}>
                    {item.usuario?.nomeCompletoUsuario || "Usuário"}
                  </Text>
                </View>
                <Text style={tw`text-gray-700 text-[14px]`}>
                  {item.textoPostagem || "Sem legenda"}
                </Text>
              </View>

              {/* Renderização da Mídia (Imagem ou Vídeo) */}
              {item.imagens?.length > 0 && (
                <PostMedia mediaPath={item.imagens[0].caminhoImagem} />
              )}

              <View style={tw`flex-row justify-end gap-4`}>
                <Pressable
                  onPress={(e) => handleOpenOptions(e, item)}
                  style={tw`p-2`}
                >
                  <View style={tw`flex-row gap-1 items-center justify-center`}>
                    <View style={tw`bg-[#61D483] w-2 h-2 rounded-full`} />
                    <View style={tw`bg-[#61D483] w-2 h-2 rounded-full`} />
                    <View style={tw`bg-[#61D483] w-2 h-2 rounded-full`} />
                  </View>
                </Pressable>
              </View>
            </View>
          )}
        />
      )}

      <FloatingOptionsModal
        visible={showFloatingModal}
        onClose={() => setShowFloatingModal(false)}
        onEdit={() => handleOpenActionModal("edit")}
        onDelete={() => handleOpenActionModal("delete")}
        position={modalPos}
      />

      {selectedPostagem && (
        <PortfolioActionModal
          isVisible={showActionModal}
          onClose={handleCloseActionModal}
          postagem={selectedPostagem}
          mode={modalMode}
          onSuccess={handleSuccessAction}
        />
      )}
    </View>
  );
}
