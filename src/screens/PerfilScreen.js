import {
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { useState, useEffect, useRef, useMemo } from "react";
import * as ImagePicker from "expo-image-picker";
import tw from "twrnc";
import usuario from "./../../services/usuario";
import TopNotification from "../components/TopNotification";
import InfoCard from "../components/InfoCard";
import { Picker } from "@react-native-picker/picker";
import Animated, { SlideInRight, SlideOutRight } from "react-native-reanimated";
import ModalPerfilEsporte from "../components/perfilComponents/ModalPerfilEsporte";
import BottomSheetCriaPerfil from "../components/BottomSheetCriaPerfil";
import { loadPerfilAll } from "./../../services/perfil";

export default function ProfileScreen() {
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewError, setViewError] = useState(false);
  const [optionProfile, setOptionProfile] = useState(false);
  const [modalEsportes, setModalEsportes] = useState(false);
  const sheetRef = useRef("null"); // Jesus amado, remover isso --Bruno
  const [perfilEsportes, setPerfilEspotes] = useState();
  const [selectedEsporte, setSelectedEsporte] = useState(null);
  const [perfis, setPerfis] = useState([]);
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [fotoBanner, setFotoBanner] = useState(null);

  // Multiplos perfis
  // Multiplos perfis
  // Multiplos perfis
  // Multiplos perfis
  // Multiplos perfis

  const abrirSheet = () => {
    setTimeout(() => {
      sheetRef.current?.present();
    }, 150);
  };

  const fecharSheet = () => {
    sheetRef.current?.dismiss();
  };

  const perfilOptions = () => {
    setOptionProfile(!optionProfile);
  };

  const [controllSheet, setControllSheet] = useState(false);
  const ControllTypeModal = (crud) => {
    setControllSheet(crud);
    setModalEsportes(true);
  };
  // _

  const formatDateToBR = (isoDate) => {
    if (!isoDate) return "";
    const datePart = isoDate.split("T")[0];
    const [year, month, day] = datePart.split("-");
    return `${day}/${month}/${year}`;
  };

  const formatDateToISO = (brDate) => {
    if (!brDate) return "";
    const [day, month, year] = brDate.split("/");
    return `${year}-${month}-${day}`;
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

  const openEditModal = () => {
    setEditData({
      nomeCompletoUsuario: userData?.nomeCompletoUsuario || "",
      dataNascimentoUsuario:
        formatDateToBR(userData?.dataNascimentoUsuario) || "",
      generoUsuario: userData?.generoUsuario || "",
      estadoUsuario: userData?.estadoUsuario || "",
      cidadeUsuario: userData?.cidadeUsuario || "",
      alturaCm: userData?.alturaCm?.toString() || "",
      pesoKg: userData?.pesoKg?.toString() || "",
      maoDominante: userData?.maoDominante || "",
      peDominante: userData?.peDominante || "",
    });
    setFotoPerfil(null);
    setFotoBanner(null);
    setShowModal(true);
  };

  const solicitarPermissoes = async () => {
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();
    const { status: galleryStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== "granted" || galleryStatus !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Permissões de câmera e galeria são necessárias para alterar as imagens."
      );
      return false;
    }
    return true;
  };

  const escolherImagem = async (tipoImagem) => {
    const temPermissao = await solicitarPermissoes();
    if (!temPermissao) return;

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (
      !resultado.canceled &&
      resultado.assets &&
      resultado.assets.length > 0
    ) {
      if (tipoImagem === "perfil") {
        setFotoPerfil(resultado.assets[0]);
      } else if (tipoImagem === "banner") {
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

      const dataToSend = { ...editData };
      if (dataToSend.dataNascimentoUsuario) {
        dataToSend.dataNascimentoUsuario = formatDateToISO(
          dataToSend.dataNascimentoUsuario
        );
      }

      for (const key in dataToSend) {
        if (dataToSend[key] !== null && dataToSend[key] !== undefined) {
          formData.append(key, String(dataToSend[key]));
        }
      }

      formData.append("_method", "PUT");

      const appendImageToForm = async (imageAsset, fieldName) => {
        if (!imageAsset) return;

        const fileName = imageAsset.uri.split("/").pop();
        const fileType = imageAsset.type
          ? `image/${imageAsset.type.split("/").pop()}`
          : fileName.includes(".png")
            ? "image/png"
            : "image/jpeg";

        if (Platform.OS === "web") {
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

      await appendImageToForm(fotoPerfil, "fotoPerfilUsuario");
      await appendImageToForm(fotoBanner, "fotoBannerUsuario");

      await usuario.editUser(formData, userData.id);

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

  // Carrega dados do usuário e logo abaixo dois useEffect relacionados

  const loadUserData = async () => {
    try {
      setLoading(true);
      const response = await usuario.splashUser();
      setUserData(response.data);
      setError(null);

      const responsePerfil = await loadPerfilAll();
      setPerfis(responsePerfil);
    } catch (err) {
      setError("Erro ao carregar dados do usuário");
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (perfis && Object.keys(perfis).length > 0 && !selectedEsporte) {
      setSelectedEsporte(Object.keys(perfis)[0]);
    }
  }, [perfis]);

  useEffect(() => {
    loadUserData();
  }, []);

  // Tela de loading

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  const infoCardsData = [
    {
      label: "Gênero",
      value: userData?.generoUsuario,
      iconSource: require("../../assets/perfil/genero_icone.png"),
      capitalizeValue: true,
    },
    {
      label: "Idade",
      value: userData?.dataNascimentoUsuario
        ? `${calcularIdade(userData.dataNascimentoUsuario)} anos`
        : null,
      iconSource: require("../../assets/perfil/calendario_icone.png"),
    },
    {
      label: "Altura",
      value: userData?.alturaCm ? `${userData.alturaCm} cm` : null,
      iconSource: require("../../assets/perfil/altura_peso_icone.png"),
    },
    {
      label: "Peso",
      value: userData?.pesoKg ? `${userData.pesoKg} kg` : null,
      iconSource: require("../../assets/perfil/altura_peso_icone.png"),
    },
    {
      label: "Pé dominante",
      value: userData?.peDominante,
      iconSource: require("../../assets/perfil/altura_peso_icone.png"),
      capitalizeValue: true,
    },
    {
      label: "Mão dominante",
      value: userData?.maoDominante,
      iconSource: require("../../assets/perfil/altura_peso_icone.png"),
      capitalizeValue: true,
    },
  ];

  const fotoPerfilUrl = // Aqui ele ta pegando as fotos da api | provavelmente existe formas melhores de fazer isso --Bruno
    fotoPerfil?.uri ??
    (userData?.fotoPerfilUsuario
      ? `http://192.168.0.102:8000/storage/${userData.fotoPerfilUsuario}`
      : null);
  const fotoBannerUrl =
    fotoBanner?.uri ??
    (userData?.fotoBannerUsuario
      ? `http://192.168.0.102:8000/storage/${userData.fotoBannerUsuario}`
      : null);

  return (
    <View style={tw`flex-1`}>
      {viewError && <TopNotification error={error} />}

      <ScrollView style={tw`flex-1`}>
        <ImageBackground
          source={
            fotoBannerUrl
              ? { uri: fotoBannerUrl }
              : require("../../assets/perfil/banner.png")
          }
          style={tw`w-full h-40`}
        />

        <View
          style={tw`pb-6 bg-white rounded-t-[18px] rounded-b-[18px] -mt-8 pt-6 relative`}
        >
          <Pressable
            onPress={openEditModal}
            style={tw`absolute right-5 top-3 p-2 rounded-full z-10`}
          >
            <Image
              source={require("../../assets/perfil/config_icone.png")}
              style={{ width: 30, height: 30 }}
            />
          </Pressable>

          <View style={tw`items-center -mt-20`}>
            <Image
              source={
                fotoPerfilUrl
                  ? { uri: fotoPerfilUrl }
                  : require("../../assets/perfil/fotoPerfil.png")
              }
              style={{
                width: 130,
                height: 130,
                borderRadius: 65,
                borderWidth: 4,
                borderColor: "white",
              }}
            />
          </View>

          <View style={tw`items-center mt-2`}>
            <Text style={tw`text-2xl font-bold text-gray-600 capitalize`}>
              {userData?.nomeCompletoUsuario}
            </Text>
          </View>
        </View>

        <View style={tw`w-full mt-1`}>
          <View style={tw`flex-row flex-wrap justify-between px-2 pt-3`}>
            {infoCardsData.map((item, index) => (
              <InfoCard key={index} {...item} />
            ))}
          </View>

          {/* MÚLTIPLOS PERFIS */}
          {/* MÚLTIPLOS PERFIS */}
          {/* MÚLTIPLOS PERFIS */}
          {/* MÚLTIPLOS PERFIS */}
          {/* MÚLTIPLOS PERFIS */}

          {/* Esse modal aqui é onde o usuario tem as opções de esporte, todos os esportes possíveis de criação e edição | ModalPerfilCRUD na pasta componentes/perfilComponents */}
          <View style={tw`flex-row flex-wrap pb-10 rounded-lg mt-6`}>
            {modalEsportes && (
              <ModalPerfilEsporte
                crud={controllSheet}
                visible={modalEsportes}
                onClose={() => setModalEsportes(false)}
                abrirSheet={abrirSheet}
                fecharSheet={fecharSheet}
                controllSheet={ControllTypeModal}
                perfis={perfis}
              />
            )}

            <View
              style={tw`flex-row justify-end w-full relative bottom-2 h-13`}
            >
              {optionProfile && (
                <Animated.View // Trocar essa animação tosca
                  entering={SlideInRight.duration(500)}
                  exiting={SlideOutRight.duration(500)}
                  style={tw`flex-row`}
                >
                  <Pressable onPress={() => ControllTypeModal("create")}>
                    <Animated.View
                      style={tw`w-16 h-13 mr-1 bg-white rounded-2`}
                    >
                      <Text style={tw`text-center m-auto`}>Criar</Text>
                    </Animated.View>
                  </Pressable>

                  <Pressable onPress={() => ControllTypeModal("update")}>
                    <Animated.View
                      style={tw`w-16 h-13 mr-1 bg-white rounded-2`}
                    >
                      <Text>Editar</Text>
                    </Animated.View>
                  </Pressable>
                </Animated.View>
              )}
            </View>

            <View style={tw`w-85 justify-end rounded-t-5`}>
              <Picker
                style={tw`w-full px-4 h-12 border-none bg-white rounded-t-5`}
                selectedValue={selectedEsporte}
                onValueChange={(value) => setSelectedEsporte(value)}
              >
                {Object.entries(perfis).map(([nomeEsporte, listaDePerfis]) => (
                  <Picker.Item
                    key={listaDePerfis[0].esporte.id}
                    label={nomeEsporte}
                    value={nomeEsporte}
                  />
                ))}
              </Picker>
            </View>

            <Pressable onPress={perfilOptions}>
              <Animated.View
                style={tw`w-16 h-11 justify-end ml-1 bg-white rounded-2`}
              />
            </Pressable>

            <View
              style={tw`w-full px-4 pt-4 flex-row rounded-tr-4 bg-white flex-wrap justify-between pb-30`}
            >
              {selectedEsporte && (
                <View style={{ marginTop: 20 }}>
                  {perfis[selectedEsporte].map((perfil) => (
                    <View key={perfil.id} style={{ marginBottom: 16 }}>
                      <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                        {perfil.esporte.nomeEsporte}
                      </Text>

                      <Text>Categoria: {perfil.categoria.nomeCategoria}</Text>

                      <Text>Posições:</Text>
                      {perfil.posicoes.map((p) => (
                        <Text key={p.id}>{p.nomePosicao}</Text>
                      ))}

                      {perfil.caracteristicas.length > 0 && (
                        <>
                          <Text>Características:</Text>
                          {perfil.caracteristicas.map((c) => (
                            <View key={c.id}>
                              <Text>{c.caracteristica}</Text>
                              <Text>
                                {c.pivot.valor} {c.unidade_medida}
                              </Text>
                            </View>
                          ))}
                        </>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* MODAL DE EDIÇÃO DE PERFIL PRINCIPAL*/}
      {/* MODAL DE EDIÇÃO DE PERFIL PRINCIPAL*/}
      {/* MODAL DE EDIÇÃO DE PERFIL PRINCIPAL*/}
      {/* MODAL DE EDIÇÃO DE PERFIL PRINCIPAL*/}
      {/* MODAL DE EDIÇÃO DE PERFIL PRINCIPAL*/}

      <Modal
        visible={showModal}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={tw`flex-1 bg-white`}>
          <View
            style={tw`flex-row items-center justify-between px-4 py-3 border-b border-gray-200`}
          >
            <Pressable style={tw`p-2`} onPress={() => setShowModal(false)}>
              <Image
                style={{ width: 12, height: 20 }}
                source={require("../../assets/cadastro/icon_voltar.png")}
              />
            </Pressable>
            <Text style={tw`text-2xl font-bold text-[#61D483]`}>
              Editar Perfil
            </Text>
            <Pressable
              style={tw`bg-[#61D483] rounded-full p-2 px-4`}
              onPress={saveInfo}
            >
              <Text style={tw`font-semibold text-base text-white`}>Salvar</Text>
            </Pressable>
          </View>

          <ScrollView>
            {/* Seção de Imagens */}
            <View style={tw`items-center mt-4 relative`}>
              <Pressable
                onPress={() => escolherImagem("banner")}
                style={tw`w-full h-40 bg-gray-200 justify-center items-center`}
              >
                <ImageBackground
                  source={
                    fotoBannerUrl
                      ? { uri: fotoBannerUrl }
                      : require("../../assets/perfil/banner.png")
                  }
                  style={tw`w-full h-full justify-center items-center`}
                >
                  <View style={tw`bg-black/40 p-2 rounded-full`}>
                    <Image
                      source={require("../../assets/perfil/camera_icone.png")}
                      style={{ width: 25, height: 20, tintColor: "white" }}
                    />
                  </View>
                </ImageBackground>
              </Pressable>

              <View style={tw`absolute -bottom-16 items-center`}>
                <Pressable
                  onPress={() => escolherImagem("perfil")}
                  style={tw`relative`}
                >
                  <Image
                    source={
                      fotoPerfilUrl
                        ? { uri: fotoPerfilUrl }
                        : require("../../assets/perfil/fotoPerfil.png")
                    }
                    style={{
                      width: 130,
                      height: 130,
                      borderRadius: 65,
                      borderWidth: 4,
                      borderColor: "white",
                    }}
                  />
                  <View
                    style={tw`absolute bottom-1 right-1 bg-[#61D483] p-2 rounded-full`}
                  >
                    <Image
                      source={require("../../assets/perfil/camera_icone.png")}
                      style={{ width: 20, height: 15, tintColor: "white" }}
                    />
                  </View>
                </Pressable>
              </View>
            </View>

            {/* Seção de Informações */}
            <View style={tw`mt-24 px-4`}>
              <Text style={tw`font-bold text-xl text-[#61D483] mb-4`}>
                Informações Pessoais
              </Text>
              {[
                { label: "Nome", key: "nomeCompletoUsuario" },
                {
                  label: "Nascimento",
                  key: "dataNascimentoUsuario",
                  isDate: true,
                },
                { label: "Gênero", key: "generoUsuario" },
                { label: "Estado", key: "estadoUsuario" },
                { label: "Cidade", key: "cidadeUsuario" },
                {
                  label: "Altura (cm)",
                  key: "alturaCm",
                  keyboardType: "numeric",
                },
                { label: "Peso (kg)", key: "pesoKg", keyboardType: "numeric" },
                { label: "Mão Dominante", key: "maoDominante" },
                { label: "Pé Dominante", key: "peDominante" },
              ].map((field) => (
                <View key={field.key} style={tw`mb-3`}>
                  <Text style={tw`text-gray-500 text-sm mb-1`}>
                    {field.label}
                  </Text>
                  <TextInput
                    value={editData[field.key] || ""}
                    onChangeText={(text) =>
                      setEditData({ ...editData, [field.key]: text })
                    }
                    placeholder={
                      field.isDate
                        ? "DD/MM/AAAA"
                        : `Digite seu ${field.label.toLowerCase()}`
                    }
                    keyboardType={
                      field.keyboardType ||
                      (field.isDate ? "numeric" : "default")
                    }
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
