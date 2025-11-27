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
import { useState, useEffect, useRef, useMemo, use } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import tw from "twrnc";
import usuario from "../services/usuario";
import TopNotification from "../components/TopNotification";
import InfoCard from "../components/perfilComponents/InfoCard";
import { Picker } from "@react-native-picker/picker";
import Animated, { SlideInRight, SlideOutRight } from "react-native-reanimated";
import ModalPerfilEsporte from "../components/perfilComponents/ModalPerfilEsporte";
import ModalEditarPerfil from "../components/perfilComponents/ModalEditarPerfil";
import BottomSheetCriaPerfil from "../components/BottomSheetCriaPerfil";
import { loadPerfilAll } from "../services/perfil";
import { API_URL } from "@env";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
  Poppins_500Medium,
} from "@expo-google-fonts/poppins";

import api from "../services/axios";

export default function ProfileScreen() {
  const [showModal, setShowModal] = useState(false);
  const [showModalAtualizar, setShowModalAtualizar] = useState(false);
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
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Poppins_500Medium,
  });
  const [campoAtual, setCampoAtual] = useState(null);
  const [valorCampo, setValorCampo] = useState("");

  const abrirModalAtualizacao = (key, label) => {
    setCampoAtual({ key, label });
    setValorCampo(editData[key] || "");
    setShowModalAtualizar(true);
  };

  const fecharModalAtualizacao = () => {
    setShowModalAtualizar(false);
  };

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

  useEffect(() => {
    async function TensPerfil() {
      const response = await api.get("/hasPerfil");
      const userHasProfile = response?.data?.hasPerfil === true;

      console.log("ai estaá", response);
      AsyncStorage.setItem("firstTime", String(userHasProfile));

      if (!userHasProfile) ControllTypeModal("create");
    }

    TensPerfil();
  }, []);

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
      Alert.alert("Erro", "ID do usuário não disponível.");
      return;
    }

    try {
      const formData = new FormData();

      const dataToSend = { ...editData };
      if (dataToSend.dataNascimentoUsuario?.includes("/")) {
        dataToSend.dataNascimentoUsuario = formatDateToISO(
          dataToSend.dataNascimentoUsuario
        );
      }

      Object.entries(dataToSend).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });

      formData.append("_method", "PUT");

      const appendImageToForm = async (imageAsset, fieldName) => {
        if (!imageAsset) return;
        const fileName = imageAsset.uri.split("/").pop();
        const fileType =
          imageAsset.type ||
          (fileName.endsWith(".png") ? "image/png" : "image/jpeg");

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

      await usuario.editUser(formData, userData.id, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      try {
        const updated = await usuario.splashUser();
        if (updated && updated.data) {
          await AsyncStorage.setItem("user", JSON.stringify(updated.data));
          setUserData(updated.data);
        }
      } catch (inner) {
        console.warn("Falha ao atualizar AsyncStorage:", inner);
      }

      await loadUserData();
      setShowModal(false);
    } catch (err) {
      console.error("Erro ao salvar perfil:", err.response?.data || err);
      setError(err.response?.data?.message || "Erro ao atualizar perfil.");
      setViewError(true);
      setTimeout(() => setViewError(false), 3000);
    }
  };

  const loadUserData = async () => {
    try {
      setLoading(true);
      const response = await usuario.splashUser();
      setUserData(response.data);
      setError(null);

      await AsyncStorage.setItem("user", JSON.stringify(response.data));

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

  const fotoPerfilUrl =
    fotoPerfil?.uri ??
    (userData?.fotoPerfilUsuario
      ? `${API_URL}/storage/${userData.fotoPerfilUsuario}`
      : null);
  const fotoBannerUrl =
    fotoBanner?.uri ??
    (userData?.fotoBannerUsuario
      ? `${API_URL}/storage/${userData.fotoBannerUsuario}`
      : null);

  return (
    <View style={tw`flex-1`}>
      {viewError && <TopNotification error={error} />}

      <ScrollView
        style={tw`flex-1 bg-white`}
        showsVerticalScrollIndicator={false}
      >
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
              source={require("../../assets/icons/edit.png")}
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
            <Text
              style={[
                tw`text-[20px] font-bold text-gray-600 capitalize`,
                { fontFamily: "Poppins_500Medium" },
              ]}
            >
              {userData?.nomeCompletoUsuario}
            </Text>
          </View>
        </View>

        <View style={tw`w-full mt-1 p-4 `}>
          <View
            style={tw`bg-[#61D48330] rounded-[18px] flex-row flex-wrap justify-between px-2 pt-3`}
          >
            {infoCardsData.map((item, index) => (
              <InfoCard key={index} {...item} />
            ))}
          </View>

          {/* MÚLTIPLOS PERFIS */}

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

          {/* Esse modal aqui é onde o usuario tem as opções de esporte, todos os esportes possíveis de criação e edição | ModalPerfilCRUD na pasta componentes/perfilComponents */}
          <View
            style={tw`flex-row w-full flex-wrap pb-10 rounded-lg mt-6 justify-between`}
          >
            <View
              style={tw`items-center justify-center bg-[#61D48330] w-[70%] rounded-full h-12`}
            >
              <Picker
                style={[
                  { fontFamily: "Poppins_500Medium" },
                  tw`w-[90%] h-full text-[#2E7844]`,
                ]}
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

            <View style={tw`flex-row gap-1`}>
              <Pressable onPress={() => ControllTypeModal("create")}>
                <Animated.View
                  style={tw`w-10 h-10 p-2 items-center justify-center mr-1 bg-white rounded-2 bg-[#61D48330]`}
                >
                  <Image
                    source={require("../../assets/icons/mais.png")}
                    style={{ width: "90%", height: "90%" }}
                  />
                </Animated.View>
              </Pressable>

              <Pressable onPress={() => ControllTypeModal("update")}>
                <Animated.View
                  style={tw`w-10 h-10 p-2 items-center justify-center mr-1 bg-white rounded-2 bg-[#61D48330]`}
                >
                  <Image
                    source={require("../../assets/icons/edit.png")}
                    style={{ width: "90%", height: "90%" }}
                  />
                </Animated.View>
              </Pressable>
            </View>

            <View
              style={tw`w-full  flex-row rounded-tr-4 flex-wrap justify-between pb-30`}
            >
              {selectedEsporte && (
                <View style={tw`mt-6 w-full`}>
                  {perfis[selectedEsporte].map((perfil) => (
                    <View
                      key={perfil.id}
                      style={tw`w-full p-4 bg-white rounded-2xl shadow-md border border-gray-200`}
                    >
                      {/* Cabeçalho */}
                      <View style={tw`mb-4 border-b border-gray-200 pb-2`}>
                        <Text
                          style={[
                            tw`text-[22px] font-bold text-[#2E7844]`,
                            { fontFamily: "Poppins_500Medium" },
                          ]}
                        >
                          {perfil.esporte.nomeEsporte}
                        </Text>
                        <Text
                          style={[
                            tw`text-[16px] text-gray-600`,
                            { fontFamily: "Poppins_500Medium" },
                          ]}
                        >
                          {perfil.categoria.nomeCategoria}
                        </Text>
                      </View>

                      {/* Posições */}
                      <View style={tw`mb-3`}>
                        <Text
                          style={[
                            tw`text-[18px] font-semibold text-[#61D483] mb-2`,
                            { fontFamily: "Poppins_500Medium" },
                          ]}
                        >
                          Posições
                        </Text>
                        <View style={tw`flex-row flex-wrap`}>
                          {perfil.posicoes.map((p) => (
                            <View
                              key={p.id}
                              style={tw`bg-[#61D48320] px-4 py-2 rounded-lg m-1`}
                            >
                              <Text
                                style={[
                                  tw`text-[#2E7844] `,
                                  { fontFamily: "Poppins_500Medium" },
                                ]}
                              >
                                {p.nomePosicao}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>

                      {/* Características */}
                      {perfil.caracteristicas.length > 0 && (
                        <View style={tw`mt-2`}>
                          <Text
                            style={[
                              tw`text-[18px] font-semibold text-[#61D483] mb-2`,
                              { fontFamily: "Poppins_500Medium" },
                            ]}
                          >
                            Características
                          </Text>
                          {perfil.caracteristicas.map((c) => (
                            <View
                              key={c.id}
                              style={[
                                tw`flex-row justify-between bg-gray-50 rounded-lg px-3 py-2 mb-2`,
                                { fontFamily: "Poppins_500Medium" },
                              ]}
                            >
                              <Text
                                style={[
                                  tw`text-gray-700 font-medium`,
                                  { fontFamily: "Poppins_500Medium" },
                                ]}
                              >
                                {c.caracteristica}
                              </Text>
                              <Text
                                style={[
                                  tw`text-gray-800`,
                                  { fontFamily: "Poppins_500Medium" },
                                ]}
                              >
                                {c.pivot.valor} {c.unidade_medida}
                              </Text>
                            </View>
                          ))}
                        </View>
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

      <ModalEditarPerfil
        visible={showModal}
        onClose={() => setShowModal(false)}
        saveInfo={saveInfo}
        editData={editData}
        setEditData={setEditData}
        fotoPerfil={fotoPerfil}
        setFotoPerfil={setFotoPerfil}
        fotoBanner={fotoBanner}
        setFotoBanner={setFotoBanner}
        fotoPerfilUrl={fotoPerfilUrl}
        fotoBannerUrl={fotoBannerUrl}
        escolherImagem={escolherImagem}
        fontsLoaded={fontsLoaded}
      />
    </View>
  );
}
