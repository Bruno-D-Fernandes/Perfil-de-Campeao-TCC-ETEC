import {
  View, Text, Image, ImageBackground, ScrollView, Pressable,
  ActivityIndicator, Modal, TextInput, Alert, Platform,
} from "react-native";
import { useState, useEffect } from "react";
import * as ImagePicker from 'expo-image-picker';
import tw from "twrnc";
import usuario from "./../../services/usuario";
import TopNotification from "../components/TopNotification";
import InfoCard from "../components/InfoCard";

export default function ProfileScreen() {
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewError, setViewError] = useState(false);

  // 1. Estados separados para cada imagem (perfil e banner)
  const [fotoPerfil, setFotoPerfil] = useState(null); // Armazena o asset da nova foto de perfil
  const [fotoBanner, setFotoBanner] = useState(null); // Armazena o asset da nova foto de banner

  const formatDateToBR = (isoDate) => {
    if (!isoDate) return "";
    const datePart = isoDate.split('T')[0];
    const [year, month, day] = datePart.split('-');
    return `${day}/${month}/${year}`;
  };

  const formatDateToISO = (brDate) => {
    if (!brDate) return "";
    const [day, month, year] = brDate.split('/');
    return `${year}-${month}-${day}`;
  };

  const openEditModal = () => {
    setEditData({
      nomeCompletoUsuario: userData?.nomeCompletoUsuario || "",
      dataNascimentoUsuario: formatDateToBR(userData?.dataNascimentoUsuario) || "",
      generoUsuario: userData?.generoUsuario || "",
      estadoUsuario: userData?.estadoUsuario || "",
      cidadeUsuario: userData?.cidadeUsuario || "",
      alturaCm: userData?.alturaCm?.toString() || "",
      pesoKg: userData?.pesoKg?.toString() || "",
      maoDominante: userData?.maoDominante || "",
      peDominante: userData?.peDominante || "",
    });
    // Reseta as imagens temporárias ao abrir o modal para não manter seleções antigas
    setFotoPerfil(null);
    setFotoBanner(null);
    setShowModal(true);
  };

  const solicitarPermissoes = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== 'granted' || galleryStatus !== 'granted') {
      Alert.alert("Permissão necessária", "Permissões de câmera e galeria são necessárias para alterar as imagens.");
      return false;
    }
    return true;
  };

  // 2. Função genérica para escolher imagem, que atualiza o estado correto
  const escolherImagem = async (tipoImagem) => {
    const temPermissao = await solicitarPermissoes();
    if (!temPermissao) return;

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!resultado.canceled && resultado.assets && resultado.assets.length > 0) {
      if (tipoImagem === 'perfil') {
        setFotoPerfil(resultado.assets[0]);
      } else if (tipoImagem === 'banner') {
        setFotoBanner(resultado.assets[0]);
      }
    }
  };

  const saveInfo = async () => {
    if (!userData?.id) {
      console.error("ID do usuário não disponível.");
      return;
    }

    try {
      const formData = new FormData();

      // Adiciona os dados de texto ao FormData
      const dataToSend = { ...editData };
      if (dataToSend.dataNascimentoUsuario) {
        dataToSend.dataNascimentoUsuario = formatDateToISO(dataToSend.dataNascimentoUsuario);
      }

      for (const key in dataToSend) {
        if (dataToSend[key] !== null && dataToSend[key] !== undefined) {
          formData.append(key, String(dataToSend[key]));
        }
      }

      formData.append('_method', 'PUT');

      // Função auxiliar para adicionar imagem ao FormData
      const appendImageToForm = async (imageAsset, fieldName) => {
        if (!imageAsset) return;

        const fileName = imageAsset.uri.split('/').pop();
        // Fallback para tipo de arquivo
        const fileType = imageAsset.type ? `image/${imageAsset.type.split('/').pop()}` : (fileName.includes('.png') ? 'image/png' : 'image/jpeg');

        if (Platform.OS === 'web') {
          const response = await fetch(imageAsset.uri);
          const blob = await response.blob();
          formData.append(fieldName, blob, fileName);
        } else {
          formData.append(fieldName, {
            uri: imageAsset.uri,
            name: fileName,
            type: fileType,
          });
        }
      };

      // 3. Adiciona AMBAS as imagens ao FormData se tiverem sido selecionadas
      await appendImageToForm(fotoPerfil, 'fotoPerfilUsuario');
      await appendImageToForm(fotoBanner, 'fotoBannerUsuario');

      await usuario.editUser(formData, userData.id);

      // Atualiza os dados do usuário na tela após o sucesso
      await loadUserData();
      setShowModal(false);
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");

    } catch (err) {
      console.error("Erro ao salvar:", err.response ? err.response.data : err);
      setError(err.response?.data?.error || "Erro ao atualizar perfil.");
      setViewError(true);
      setTimeout(() => setViewError(false), 3000);
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
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  const infoCardsData = [
    { label: "Gênero", value: userData?.generoUsuario, iconSource: require("../../assets/perfil/genero_icone.png"), capitalizeValue: true },
    { label: "Idade", value: userData?.dataNascimentoUsuario ? `${calcularIdade(userData.dataNascimentoUsuario)} anos` : null, iconSource: require("../../assets/perfil/calendario_icone.png") },
    { label: "Altura", value: userData?.alturaCm ? `${userData.alturaCm} cm` : null, iconSource: require("../../assets/perfil/altura_peso_icone.png") },
    { label: "Peso", value: userData?.pesoKg ? `${userData.pesoKg} kg` : null, iconSource: require("../../assets/perfil/altura_peso_icone.png") },
    { label: "Pé dominante", value: userData?.peDominante, iconSource: require("../../assets/perfil/altura_peso_icone.png"), capitalizeValue: true },
    { label: "Mão dominante", value: userData?.maoDominante, iconSource: require("../../assets/perfil/altura_peso_icone.png"), capitalizeValue: true },
  ];

  const fotoPerfilUrl = fotoPerfil?.uri ?? (userData?.fotoPerfilUsuario ? `http://192.168.0.100:8000/storage/${userData.fotoPerfilUsuario}` : null);
  const fotoBannerUrl = fotoBanner?.uri ?? (userData?.fotoBannerUsuario ? `http://192.168.0.100:8000/storage/${userData.fotoBannerUsuario}` : null);

  return (
    <View style={tw`flex-1`}>
      {viewError && <TopNotification error={error} />}

      <ScrollView style={tw`flex-1`}>
        <ImageBackground
          source={fotoBannerUrl ? { uri: fotoBannerUrl } : require("../../assets/perfil/banner.png")}
          style={tw`w-full h-40`}
        />

        <View style={tw`pb-6 bg-white rounded-t-[18px] rounded-b-[18px] -mt-8 pt-6 relative`}>
          <Pressable onPress={openEditModal} style={tw`absolute right-5 top-3 p-2 rounded-full z-10`}>
            <Image source={require("../../assets/perfil/config_icone.png")} style={{ width: 30, height: 30 }} />
          </Pressable>

          <View style={tw`items-center -mt-20`}>
            <Image
              source={fotoPerfilUrl ? { uri: fotoPerfilUrl } : require("../../assets/perfil/fotoPerfil.png")}
              style={{ width: 130, height: 130, borderRadius: 65, borderWidth: 4, borderColor: 'white' }}
            />
          </View>

          <View style={tw`items-center mt-2`}>
            <Text style={tw`text-2xl font-bold text-gray-600 capitalize`}>{userData?.nomeCompletoUsuario}</Text>

            <View style={tw`flex-row justify-around w-full mt-4 px-8`}>
              <View style={tw`items-center`}>
                <Text style={tw`text-lg font-bold text-[#4ADC76]`}>120</Text>
                <Text style={tw`text-sm text-gray-500`}>Seguidores</Text>
              </View>
              <View style={tw`items-center`}>
                <Text style={tw`text-lg font-bold text-[#4ADC76]`}>350</Text>
                <Text style={tw`text-sm text-gray-500`}>Seguindo</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={tw`w-full mt-1`}>
          <Text style={tw`text-lg font-bold text-gray-700 mb-3 px-2`}>Informações</Text>
          <View style={tw`flex-row flex-wrap justify-between`}>
            {infoCardsData.map((item, index) => (
              <InfoCard key={index} {...item} />
            ))}
          </View>

          <View style={tw`flex-row bg-red-200 flex-wrap justify-between pb-10 rounded-lg mt-6`}>
            <View style={tw`w-full h-10 flex-row bg-blue-200 mb-4`}>
              <Pressable className={tw`w-50 bg-green-400`}> <Text>Mais perfil </Text></Pressable>
              <Pressable> Mais perfil </Pressable>
            </View>


            {infoCardsData.map((item, index) => (
              <InfoCard key={index} {...item} />
            ))}
          </View>
        </View>
      </ScrollView>

      <Modal visible={showModal} animationType="slide" onRequestClose={() => setShowModal(false)}>
        <View style={tw`flex-1 bg-white`}>
          <View style={tw`flex-row items-center justify-between px-4 py-3 border-b border-gray-200`}>
            <Pressable style={tw`p-2`} onPress={() => setShowModal(false)}>
              <Image style={{ width: 12, height: 20 }} source={require("../../assets/cadastro/icon_voltar.png")} />
            </Pressable>
            <Text style={tw`text-2xl font-bold text-[#61D483]`}>Editar Perfil</Text>
            <Pressable style={tw`bg-[#61D483] rounded-full p-2 px-4`} onPress={saveInfo}>
              <Text style={tw`font-semibold text-base text-white`}>Salvar</Text>
            </Pressable>
          </View>

          <ScrollView>
            {/* Seção de Imagens */}
            <View style={tw`items-center mt-4 relative`}>
              <Pressable onPress={() => escolherImagem('banner')} style={tw`w-full h-40 bg-gray-200 justify-center items-center`}>
                <ImageBackground
                  source={fotoBannerUrl ? { uri: fotoBannerUrl } : require("../../assets/perfil/banner.png")}
                  style={tw`w-full h-full justify-center items-center`}
                >
                  <View style={tw`bg-black/40 p-2 rounded-full`}>
                    <Image source={require("../../assets/perfil/camera_icone.png")} style={{ width: 25, height: 20, tintColor: 'white' }} />
                  </View>
                </ImageBackground>
              </Pressable>

              <View style={tw`absolute -bottom-16 items-center`}>
                <Pressable onPress={() => escolherImagem('perfil')} style={tw`relative`}>
                  <Image
                    source={fotoPerfilUrl ? { uri: fotoPerfilUrl } : require("../../assets/perfil/fotoPerfil.png")}
                    style={{ width: 130, height: 130, borderRadius: 65, borderWidth: 4, borderColor: 'white' }}
                  />
                  <View style={tw`absolute bottom-1 right-1 bg-[#61D483] p-2 rounded-full`}>
                    <Image source={require("../../assets/perfil/camera_icone.png")} style={{ width: 20, height: 15, tintColor: 'white' }} />
                  </View>
                </Pressable>
              </View>
            </View>

            {/* Seção de Informações */}
            <View style={tw`mt-24 px-4`}>
              <Text style={tw`font-bold text-xl text-[#61D483] mb-4`}>Informações Pessoais</Text>
              {[
                { label: "Nome", key: "nomeCompletoUsuario" },
                { label: "Nascimento", key: "dataNascimentoUsuario", isDate: true },
                { label: "Gênero", key: "generoUsuario" },
                { label: "Estado", key: "estadoUsuario" },
                { label: "Cidade", key: "cidadeUsuario" },
                { label: "Altura (cm)", key: "alturaCm", keyboardType: "numeric" },
                { label: "Peso (kg)", key: "pesoKg", keyboardType: "numeric" },
                { label: "Mão Dominante", key: "maoDominante" },
                { label: "Pé Dominante", key: "peDominante" },
              ].map((field) => (
                <View key={field.key} style={tw`mb-3`}>
                  <Text style={tw`text-gray-500 text-sm mb-1`}>{field.label}</Text>
                  <TextInput
                    value={editData[field.key] || ""}
                    onChangeText={(text) => setEditData({ ...editData, [field.key]: text })}
                    placeholder={field.isDate ? "DD/MM/AAAA" : `Digite seu ${field.label.toLowerCase()}`}
                    keyboardType={field.keyboardType || (field.isDate ? "numeric" : "default")}
                    style={tw`bg-gray-100 rounded-lg p-3 text-base text-gray-800`}
                  />
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
