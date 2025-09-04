import { View, Text, Image, ScrollView, Pressable, ActivityIndicator, Modal, TextInput } from "react-native";
import { useState, useEffect, use } from "react";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import usuario from "../../services/usuario" 
import axios from "axios";

export default function ProfileScreen() {
  const [showModal, setShowModal] = useState(false);
  const [openSettings, setOpenSettings] = useState({});
  const [editData, setEditData] = useState({});
  const [activeTab, setActiveTab] = useState("info");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const openEditModal = () => {
    setEditData({
      nomeCompletoUsuario: userData?.nomeCompletoUsuario || "",
      emailUsuario: userData?.emailUsuario || "",
      dataNascimentoUsuario: userData?.dataNascimentoUsuario || "",
      generoUsuario: userData?.generoUsuario || "",
      estadoUsuario: userData?.estadoUsuario || "",
      cidadeUsuario: userData?.cidadeUsuario || "",
      alturaCm: userData?.alturaCm || "",
      temporadasUsuario: userData?.temporadasUsuario?.toString() || "",
    });
    setShowModal(true);
  };

  const saveInfo = async () => {
    try {
      await usuario.editUser(editData, userData.id);
      setUserData({ ...userData, ...editData });
      setShowModal(false);
    } catch (err) {
      console.error("Erro ao salvar:", err);
    }
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
            onPress={openEditModal}
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

              {userData?.alturaCm && (
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
      <Modal visible={showModal} animationType="slide">
  <View className="flex-1 bg-white">
    {/* Header */}
    <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
      <Pressable onPress={() => setShowModal(false)}>
        <Ionicons name="arrow-back" size={24} color="green" />
      </Pressable>
      <Text className="text-lg font-bold text-green-600">Editar perfil</Text>
      <Pressable className="bg-green-500 px-3 py-1 rounded-full"
       onPress={saveInfo}>
        <Text className="text-white font-bold">Salvar</Text>
      </Pressable>
    </View>

    {/* Foto de Perfil + Banner */}
    <View className="items-center mt-6">
      <View className="relative">
        <Image
          source={{ uri: editData.fotoPerfilUsuario || "https://picsum.photos/200" }}
          className="w-28 h-28 rounded-full"
        />
        <Pressable className="absolute bottom-0 right-0 bg-green-500 p-2 rounded-full">
          <Ionicons name="camera" size={16} color="white" />
        </Pressable>
      </View>
    </View>

    {/* Scroll com campos */}
    <ScrollView className="mt-6 px-4">
      <Text className="text-green-600 text-lg font-bold mb-3">Informações</Text>

      {[
        { label: "Nome Completo", key: "nomeCompletoUsuario" },
        { label: "Email", key: "emailUsuario" },
        { label: "Data de Nascimento", key: "dataNascimentoUsuario" },
        { label: "Gênero", key: "generoUsuario" },
        { label: "Estado", key: "estadoUsuario" },
        { label: "Cidade", key: "cidadeUsuario" },
        { label: "Altura (cm)", key: "alturaCm" },
        { label: "Temporadas", key: "temporadasUsuario" },
      ].map((field, index) => (
        <View
          key={index}
          className="bg-gray-50 rounded-xl p-3 mb-3 flex-row justify-between items-center"
        >
          <View className="flex-1 mr-2">
            <Text className="text-gray-500 text-sm">{field.label}</Text>
            <TextInput
              value={editData[field.key] || ""}
              secureTextEntry={field.secure || false}
              onChangeText={(text) =>
                setEditData({ ...editData, [field.key]: text })
              }
              className="text-green-700 font-bold"
            />
          </View>
          <Ionicons name="create-outline" size={20} color="green" />
        </View>
      ))}
    </ScrollView>
  </View>
</Modal>
    </View>
  );
}
