import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import tw from "twrnc";
import * as ImagePicker from "expo-image-picker"; // Adicionado para seleção de imagem

import {
  updatePostagemUser, // Assumindo que esta função lida com FormData
  deletePostagemUser,
} from "../../../services/postagem";

export default function PortfolioActionModal({
  isVisible,
  onClose,
  postagem,
  onSuccess,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(postagem?.textoPostagem || "");
  const [selectedImage, setSelectedImage] = useState(null); // Novo estado para a imagem selecionada
  const [isLoading, setIsLoading] = useState(false);

  // Funções de serviço (mantidas as chamadas reais)
  const updatePostagem = async (id, data) => {
    const response = await updatePostagemUser(id, data);
    console.log(response);
  };

  const deletePostagem = async (id) => {
    const response = deletePostagemUser(id);
    console.log(response);
  };

  // Função para selecionar uma nova imagem
  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleUpdate = async () => {
    if (!newText.trim() && !selectedImage) {
      console.log(
        "Erro",
        "A postagem precisa de texto ou imagem para ser atualizada."
      );
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();

      formData.append("textoPostagem", newText);

      formData.append("_method", "PUT");

      if (selectedImage) {
        const fileName = selectedImage.split("/").pop() || "image.jpg";

        let fileType;
        if (fileName.toLowerCase().endsWith(".png")) {
          fileType = "image/png";
        } else if (
          fileName.toLowerCase().endsWith(".jpg") ||
          fileName.toLowerCase().endsWith(".jpeg")
        ) {
          fileType = "image/jpeg";
        } else {
          fileType = "application/octet-stream";
        }

        if (Platform.OS === "web") {
          const response = await fetch(selectedImage);
          const blob = await response.blob();
          formData.append("imagem", blob, fileName);
        } else {
          formData.append("imagem", {
            uri: selectedImage,
            name: fileName,
            type: fileType,
          });
        }
      }

      await updatePostagem(postagem.id, formData);

      console.log("Sucesso", "Postagem atualizada com sucesso!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar postagem:", error);
      console.log(
        "Erro",
        "Não foi possível atualizar a postagem. Tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePostagem(postagem.id);
      console.log("Sucesso", "Postagem excluída com sucesso!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao excluir postagem:", error);
      console.log(
        "Erro",
        "Não foi possível excluir a postagem. Tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color="#49D372" />
          <Text style={tw`mt-2 text-gray-500`}>Processando...</Text>
        </View>
      );
    }

    if (isEditing) {
      const imageSource = selectedImage
        ? { uri: selectedImage }
        : postagem.imagens && postagem.imagens.length > 0
          ? {
              uri: `http://192.168.0.103:8000/storage/${postagem.imagens[0].caminhoImagem}`,
            }
          : null;

      return (
        <View style={tw`flex-1 w-full p-4`}>
          <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>
            Editar Postagem
          </Text>
          <TextInput
            style={tw`w-full h-32 bg-gray-100 p-3 rounded-lg border border-gray-300 text-gray-700`}
            multiline={true}
            placeholder="Edite o texto da sua postagem..."
            value={newText}
            onChangeText={(text) => setNewText(text)}
          />

          {/* Botão para selecionar uma nova imagem */}
          <Pressable
            style={tw`mt-4 p-3 bg-blue-100 rounded-lg border border-blue-300`}
            onPress={handleImagePick}
          >
            <Text style={tw`text-blue-600 font-semibold text-center`}>
              {selectedImage ? "Trocar Imagem" : "Selecionar Nova Imagem"}
            </Text>
          </Pressable>

          {/* Visualização da Imagem (Nova ou Atual) */}
          {imageSource ? (
            <Image
              source={imageSource}
              style={tw`w-full h-48 mt-2 rounded-lg`}
              resizeMode="cover"
            />
          ) : (
            <View
              style={tw`w-full h-48 mt-2 bg-gray-300 rounded-lg justify-center items-center`}
            >
              <Text style={tw`text-gray-500`}>Sem imagem</Text>
            </View>
          )}

          <View style={tw`flex-row justify-end mt-4`}>
            <Pressable
              style={tw`bg-gray-400 px-4 py-2 rounded-lg mr-2`}
              onPress={() => {
                setIsEditing(false);
                setNewText(postagem?.textoPostagem || ""); // Reseta o texto
                setSelectedImage(null); // Reseta a imagem selecionada
              }}
            >
              <Text style={tw`text-white font-semibold`}>Cancelar</Text>
            </Pressable>
            <Pressable
              style={tw`bg-green-500 px-4 py-2 rounded-lg`}
              onPress={handleUpdate}
            >
              <Text style={tw`text-white font-semibold`}>
                Salvar Alterações
              </Text>
            </Pressable>
          </View>
        </View>
      );
    }

    return (
      <View style={tw`flex-1 w-full p-4`}>
        <Text style={tw`text-xl font-bold text-gray-800 mb-6`}>
          Ações da Postagem
        </Text>

        {/* Botão de Editar */}
        <Pressable
          style={tw`flex-row items-center p-3 bg-blue-500 rounded-lg mb-4`}
          onPress={() => setIsEditing(true)}
        >
          <Icon name="edit" size={20} color="#FFF" style={tw`mr-3`} />
          <Text style={tw`text-white font-semibold text-lg`}>
            Editar Postagem
          </Text>
        </Pressable>

        {/* Botão de Excluir */}
        <Pressable
          style={tw`flex-row items-center p-3 bg-red-500 rounded-lg`}
          onPress={handleDelete}
        >
          <Icon name="trash" size={20} color="#FFF" style={tw`mr-3`} />
          <Text style={tw`text-white font-semibold text-lg`}>
            Excluir Postagem
          </Text>
        </Pressable>

        {/* Visualização da Postagem Atual */}
        <View
          style={tw`mt-6 p-3 bg-gray-100 rounded-lg border border-gray-200`}
        >
          <Text style={tw`text-sm font-semibold text-gray-600 mb-1`}>
            Postagem Selecionada:
          </Text>
          <Text style={tw`text-gray-700 italic`} numberOfLines={3}>
            {postagem?.textoPostagem || "Nenhum texto de postagem."}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={styles.modalView}
          onPress={(e) => e.stopPropagation()}
        >
          {renderContent()}
          <Pressable style={tw`absolute top-3 right-3 p-2`} onPress={onClose}>
            <Icon name="close" size={24} color="#374151" />
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
    maxHeight: "80%",
  },
});
