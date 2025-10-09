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

  // Função para formatar a data de ISO (2007-10-22T...) para BR (22/10/2007)
  const formatDateToBR = (isoDate) => {
    if (!isoDate) return "";
    // Pega a parte da data (YYYY-MM-DD) e inverte para DD/MM/YYYY
    const datePart = isoDate.split('T')[0];
    const [year, month, day] = datePart.split('-');
    return `${day}/${month}/${year}`;
  };

  // Função para formatar a data de BR (22/10/2007) para ISO simples (2007-10-22)
  const formatDateToISO = (brDate) => {
    if (!brDate) return "";
    // Assume DD/MM/YYYY e converte para YYYY-MM-DD
    const [day, month, year] = brDate.split('/');
    // Retorna YYYY-MM-DD
    return `${year}-${month}-${day}`;
  };

  const openEditModal = () => {
    setEditData({
      nomeCompletoUsuario: userData?.nomeCompletoUsuario || "",
      emailUsuario: userData?.emailUsuario || "",
      // Formata a data para exibição no modal
      dataNascimentoUsuario: formatDateToBR(userData?.dataNascimentoUsuario) || "",
      generoUsuario: userData?.generoUsuario || "",
      estadoUsuario: userData?.estadoUsuario || "",
      cidadeUsuario: userData?.cidadeUsuario || "",
      alturaCm: userData?.alturaCm?.toString() || "",
    });
    setShowModal(true);
  };

  const saveInfo = async () => {
    try {
      const dataToSend = { ...editData };

      // Converte a data de volta para o formato YYYY-MM-DD antes de enviar
      if (dataToSend.dataNascimentoUsuario) {
        dataToSend.dataNascimentoUsuario = formatDateToISO(dataToSend.dataNascimentoUsuario);
      }

      await usuario.editUser(dataToSend, userData.id);
      
      // Atualiza o estado local com a data no formato ISO (YYYY-MM-DD) para consistência
      setUserData({ ...userData, ...dataToSend });
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
      <View className="flex-1 justify-center items-center bg-white ">
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
      source={require("../../assets/perfil/banner.png")}
      className="w-full h-40"
    />
    <Pressable
        onPress={openEditModal}
        className="absolute right-5 top-36 bg-white p-2 rounded-full"
      >
        <Image
          source={require("../../assets/perfil/config_icone.png")}
          style={{ width: 30, height: 30 }}
        />
      </Pressable>
    
      <View
      className="flex-1 bg-white rounded-t-[30px] -mt-8 pt-6 relative"
      pointerEvents="box-none"
      >
      <Pressable
      onPress={openEditModal}
      className="absolute right-5 top-3 p-2 rounded-full"
      style={{
      elevation: 4,
      zIndex: 10, 
      }}
      >
    <Image
      source={require("../../assets/perfil/config_icone.png")}
      style={{ width: 30, height: 30 }}
    />
  </Pressable>

  {/* Foto de Perfil */}
  <View className="items-center -mt-14">
    <Image
      source={require("../../assets/perfil/fotoPerfil.png")}
      style={{
        width: 92,
        height: 92,
        borderColor: "#fff",
        borderWidth: 7,
        borderRadius: 45,
      }}
    />
  </View>

  {/* Nome e medalha */}
  <View className="items-center mt-2">
    <View className="flex-row items-center">
      <Text className="text-2xl font-bold text-[#959595be] capitalize">
        {userData?.nomeCompletoUsuario}
      </Text>
    </View>
    <Text className="text-xl font-bold text-[#959595] mt-1 capitalize">
      {userData?.nomeUsuario}
    </Text>
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
                ? "text-[#61D483] font-bold"
                : "text-[#61d484d6]"
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
                ? "text-[#61D483] font-bold"
                : "text-[#61d484d6]"
            }`}
          >
            Informações
          </Text>
        </Pressable>
      </View>

      {/* Conteúdo das Tabs */}
      <View className="w-[95%] h-[35%] bg-[#61d48468] rounded-3xl p-4 m-auto mt-[10%]">
        {activeTab === "info" ? (
          <View>
            {/* Grid de informações */}
            <View className="flex-row flex-wrap justify-between">
              {userData?.generoUsuario && (
                <View className="bg-white w-[48%] rounded-xl p-4 mb-3">
                  <Image
                    source={require("../../assets/perfil/genero_icone.png")}
                    className="w-10 h-10 rounded-full"
                  />
                  <Text className="text-[#61D483] text-sm">Gênero</Text>
                  <Text className="text-green-600 font-bold capitalize">
                    {userData.generoUsuario}
                  </Text>
                </View>
              )}

              {userData?.dataNascimentoUsuario && (
                <View className="bg-white w-[48%] rounded-xl p-4 mb-3">
                  <Image
                    source={require("../../assets/perfil/calendario_icone.png")}
                    className="w-10 h-10 rounded-full"
                  />
                  <Text className="text-[#61D483] text-sm">Idade</Text>
                  <Text className="text-green-600 font-bold">
                    {calcularIdade(userData.dataNascimentoUsuario)} anos
                  </Text>
                </View>
              )}

              {userData?.alturaCm && (
                <View className="bg-white w-[48%] rounded-xl p-4 mb-3">
                  <Image
                    source={require("../../assets/perfil/altura_peso_icone.png")}
                    className="w-10 h-10 rounded-full"
                  />
                  <Text className="text-[#61D483] text-sm">Altura</Text>
                  <Text className="text-green-600 font-bold">
                    {userData.alturaCm} cm
                  </Text>
                </View>
              )}

              {userData?.pesoKg && (
                <View className="bg-white w-[48%] rounded-xl p-4 mb-3">
                  <Image
                    source={require("../../assets/perfil/altura_peso_icone.png")}
                    className="w-10 h-10 rounded-full"
                  />
                  <Text className="text-[#61D483] text-sm">Peso</Text>
                  <Text className="text-green-600 font-bold">
                    {userData.pesoKg} kg
                  </Text>
                </View>
              )}
            </View>
          </View>
        ) : (
          <Text className="text-center text-gray-500">
            Feed em construção...
          </Text>
        )}
      </View>
    </View>

      {/* Modal de edição */}
      <Modal visible={showModal} animationType="slide">
        <View className="flex-1 bg-white">
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
            
            <Pressable
              style={tw`justify-center items-center w-[10%] h-full rounded-full bg-[#4ADC76]`}
              onPress={() => setShowModal(false)}
            >
              <Image
                style={{ width: 12, height: 20 }}
                source={require("../../assets/cadastro/icon_voltar.png")}
              />
            </Pressable>
            <Text className="text-[25px] font-bold text-[#61D483] ml-[18px]">Editar perfil</Text>
            <Pressable
              style={tw`flex-row justify-between w-[25%] h-10 bg-[#61D483] rounded-full items-center`}
              onPress={saveInfo}
            >
              <Text style={tw`ml-3 font-semibold text-base text-white`}>Salvar</Text>
              <View style={tw`justify-center items-center w-[25%] h-[55%] rounded-full bg-white right-3`}>
                <Image 
                style={{ width:12, height: 12 }}
                source={require('../../assets/perfil/salvar_botao.png')} />
              </View>
            </Pressable>
          </View>
          
          <View className="items-center mt-[10%]" style={{ position: "relative" }}>
            <Image
            source={require("../../assets/perfil/fotoPerfil.png")}
            style={{
            width: 130,
            height: 130,
            borderRadius: 65,
            }}
            />
          <View
            style={{
            position: "absolute",
            bottom: 0, // no rodapé da imagem
            right: '37%',  // canto direito
            width: 27,
            height: 27,
            borderRadius: 13.5,
            backgroundColor: "#61D483",
            justifyContent: "center",
            alignItems: "center",
            }}
            >
          <Image
            source={require("../../assets/perfil/camera_icone.png")}
            style={{
            width: 20,
            height: 15,
            }}
          />
      </View>
      </View>

          <Text className="font-bold text-[25px] text-[#61D483] ml-[15px]">
            Informações
          </Text>
          <ScrollView className="mt-6 px-4">
            {[
              { label: "Nome", key: "nomeCompletoUsuario" },
              { label: "Email", key: "emailUsuario" },
              { label: "Nascimento", key: "dataNascimentoUsuario", isDate: true },
              { label: "Gênero", key: "generoUsuario" },
              { label: "Estado", key: "estadoUsuario" },
              { label: "Cidade", key: "cidadeUsuario" },
              { label: "Altura (cm)", key: "alturaCm" },
            ].map((field, index) => (
        <View
        key={index}
        className="bg-gray-50 rounded-xl p-3 mb-3 flex-row justify-between items-center"
        > 
        <View className="flex-row items-center flex-1 mr-3">
        <Text className="text-[#61D483] text-[17px] font-bold mr-2">
          {field.label}:
        </Text>
        <TextInput
          value={editData[field.key] || ""}
          onChangeText={(text) =>
            setEditData({ ...editData, [field.key]: text })
          }
          placeholder={field.isDate ? "DD/MM/AAAA" : ""}
          keyboardType={field.isDate ? "numeric" : "default"}
          className="text-green-700 font-bold flex-1 text-[17px]"
          style={{ minWidth: 80 }} 
        />
      </View>

      <Text className="font-bold text-[#61D483]">
        Editar
      </Text>
    </View>
  ))}
</ScrollView>

        </View>
      </Modal>
    </View>
  );
}
