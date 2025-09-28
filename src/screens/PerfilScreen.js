import { 
  View, Text, Image, ImageBackground, ScrollView, Pressable, 
  ActivityIndicator, Modal, TextInput,  
} from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import usuario from "./../../services/usuario";

export default function ProfileScreen() {
  const [showModal, setShowModal] = useState(false);
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
      alturaCm: userData?.alturaCm?.toString() || "",
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

        <Pressable
          style={tw`absolute right-4 top-8 bg-white p-2 rounded-full shadow`}
          onPress={openEditModal}
        >
          <Ionicons name="settings" size={22} color="green" />
        </Pressable>
      </View>

      {/* Nome */}
      <View className="items-center mt-2">
        <Text className="text-2xl font-bold text-gray-800">
          {userData?.nomeCompletoUsuario || "Usuário"}
        </Text>
        <Text className="text-xl font-bold text-gray-800 mt-1">
          {userData?.nomeUsuario || "Usuário"}
        </Text>
        <Ionicons name="medal-outline" size={20} color="gray" />
      </View>

      {/* Tabs */}
      <View className="flex-row justify-center mt-4 border-b border-gray-200">
        <Pressable
          className={`px-6 pb-2 ${activeTab === "feed" ? "border-b-2 border-green-500" : ""}`}
          onPress={() => setActiveTab("feed")}
        >
          <Text className={`text-base ${activeTab === "feed" ? "text-green-600 font-bold" : "text-gray-500"}`}>
            Feed
          </Text>
        </Pressable>
        <Pressable
          className={`px-6 pb-2 ${activeTab === "info" ? "border-b-2 border-green-500" : ""}`}
          onPress={() => setActiveTab("info")}
        >
          <Text className={`text-base ${activeTab === "info" ? "text-green-600 font-bold" : "text-gray-500"}`}>
            Informações
          </Text>
        </Pressable>
      </View>

      {/* Conteúdo das Tabs */}
      <ScrollView className="flex-1 px-4 py-4 bg-green-50">
        {activeTab === "info" ? (
          <View>
            {/* Grid de informações */}
            <View className="flex-row flex-wrap justify-between">
              {userData?.generoUsuario && (
                <View className="bg-green-100 w-[48%] rounded-xl p-4 mb-3">
                  <Ionicons name="male-female-outline" size={18} color="green" />
                  <Text className="text-gray-600 text-sm">Gênero</Text>
                  <Text className="text-green-600 font-bold">{userData.generoUsuario}</Text>
                </View>
              )}

              {userData?.dataNascimentoUsuario && (
                <View className="bg-green-100 w-[48%] rounded-xl p-4 mb-3">
                  <Ionicons name="calendar-outline" size={18} color="green" />
                  <Text className="text-gray-600 text-sm">Idade</Text>
                  <Text className="text-green-600 font-bold">{calcularIdade(userData.dataNascimentoUsuario)} anos</Text>
                </View>
              )}

              {userData?.alturaCm && (
                <View className="bg-green-100 w-[48%] rounded-xl p-4 mb-3">
                  <Ionicons name="resize-outline" size={18} color="green" />
                  <Text className="text-gray-600 text-sm">Altura</Text>
                  <Text className="text-green-600 font-bold">{userData.alturaCm} cm</Text>
                </View>
              )}

              {userData?.pesoKg && (
                <View className="bg-green-100 w-[48%] rounded-xl p-4 mb-3">
                  <Ionicons name="barbell-outline" size={18} color="green" />
                  <Text className="text-gray-600 text-sm">Peso</Text>
                  <Text className="text-green-600 font-bold">{userData.pesoKg} kg</Text>
                </View>
              )}
            </View>
          </View>
        ) : (
          <Text className="text-center text-gray-500">Feed em construção...</Text>
        )}
      </ScrollView>

      {/* Modal de edição */}
      <Modal visible={showModal} animationType="slide">
        <View className="flex-1 bg-white">
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
            <Pressable onPress={() => setShowModal(false)}>
              <Ionicons name="arrow-back" size={24} color="green" />
            </Pressable>
            <Text className="text-lg font-bold text-green-600">Editar perfil</Text>
            <Pressable
              className="bg-green-500 px-3 py-1 rounded-full"
              onPress={saveInfo}
            >
              <Text className="text-white font-bold">Salvar</Text>
            </Pressable>
          </View>

          <ScrollView className="mt-6 px-4">
            {[
              { label: "Nome Completo", key: "nomeCompletoUsuario" },
              { label: "Email", key: "emailUsuario" },
              { label: "Data de Nascimento", key: "dataNascimentoUsuario" },
              { label: "Gênero", key: "generoUsuario" },
              { label: "Estado", key: "estadoUsuario" },
              { label: "Cidade", key: "cidadeUsuario" },
              { label: "Altura (cm)", key: "alturaCm" },
            ].map((field, index) => (
              <View
                key={index}
                className="bg-gray-50 rounded-xl p-3 mb-3 flex-row justify-between items-center"
              >
                <View className="flex-1 mr-2">
                  <Text className="text-gray-500 text-sm">{field.label}</Text>
                  <TextInput
                    value={editData[field.key] || ""}
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
