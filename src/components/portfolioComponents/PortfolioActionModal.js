import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Image,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import tw from "twrnc";
import * as ImagePicker from "expo-image-picker";

import {
  updatePostagemUser,
  deletePostagemUser,
} from "../../../services/postagem";

export default function PortfolioActionModal({
  isVisible,
  onClose,
  postagem,
  onSuccess,
  mode = "edit", // "edit" ou "delete"
}) {
  const [newText, setNewText] = useState(postagem?.textoPostagem || "");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const updatePostagem = async (id, data) => {
    const response = await updatePostagemUser(id, data);
    console.log(response);
  };

  const deletePostagem = async (id) => {
    const response = await deletePostagemUser(id);
    console.log(response);
  };

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
      console.log("Erro", "A postagem precisa de texto ou imagem para ser atualizada.");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("textoPostagem", newText);
      formData.append("_method", "PUT");

      if (selectedImage) {
        const fileName = selectedImage.split("/").pop() || "image.jpg";
        const fileType = fileName.toLowerCase().endsWith(".png")
          ? "image/png"
          : fileName.toLowerCase().match(/\.(jpg|jpeg)$/)
          ? "image/jpeg"
          : "application/octet-stream";

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
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar postagem:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deletePostagem(postagem.id);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao excluir postagem:", error);
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

    // Modo de exclusão simples (confirmação)
    if (mode === "delete") {
      return (
        <View style={tw`p-4`}>
          <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>
            Deseja realmente excluir esta postagem?
          </Text>
          <View style={tw`flex-row justify-end`}>
            <Pressable
              style={tw`bg-gray-400 px-4 py-2 rounded-lg mr-2`}
              onPress={onClose}
            >
              <Text style={tw`text-white font-semibold`}>Cancelar</Text>
            </Pressable>
            <Pressable
              style={tw`bg-red-500 px-4 py-2 rounded-lg`}
              onPress={handleDelete}
            >
              <Text style={tw`text-white font-semibold`}>Excluir</Text>
            </Pressable>
          </View>
        </View>
      );
    }

    // Modo de edição
    const imageSource = selectedImage
      ? { uri: selectedImage }
      : postagem.imagens && postagem.imagens.length > 0
      ? {
          uri: `http://192.168.0.103:8000/storage/${postagem.imagens[0].caminhoImagem}`,
        }
      : null;

    return (
      <View style={tw`flex-1 w-full p-4`}>
        <Text style={[tw`text-xl text-gray-800 mb-4`, {fontFamily:"Poppins_500Medium",}]}>
          Editar Postagem
        </Text>

        <TextInput
          style={tw`w-full h-32 p-3 rounded-lg border border-gray-300 text-gray-700`}
          multiline={true}
          placeholder="Edite o texto da sua postagem..."
          value={newText}
          onChangeText={(text) => setNewText(text)}
        />

        <Pressable
          style={tw`mt-4 p-3 bg-[#61D48340] rounded-lg`}
          onPress={handleImagePick}
        >
          <Text style={[tw`text-[#379d55] text-center`, {fontFamily:"Poppins_500Medium"}]}>
            {selectedImage ? "Trocar Imagem" : "Selecionar Nova Imagem"}
          </Text>
        </Pressable>

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
            onPress={onClose}
          >
            <Text style={tw`text-white font-semibold`}>Cancelar</Text>
          </Pressable>
          <Pressable
            style={tw`bg-green-500 px-4 py-2 rounded-lg`}
            onPress={handleUpdate}
          >
            <Text style={tw`text-white`}>Salvar Alterações</Text>
          </Pressable>
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
        <Pressable style={styles.modalView} onPress={(e) => e.stopPropagation()}>
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
    maxHeight: "80%",
  },
});
