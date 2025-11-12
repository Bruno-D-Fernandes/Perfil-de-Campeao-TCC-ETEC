import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  ImageBackground,
  Modal,
  TouchableOpacity,
} from "react-native";
import tw from "twrnc";
import { Picker } from "@react-native-picker/picker";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import ModalAtualizarCampo from "./ModalAtualizarCampo";
import usuario from "../../../services/usuario";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function ModalEditarPerfil({
  visible,
  onClose,
  saveInfo,
  editData,
  setEditData,
  fotoPerfil,
  setFotoPerfil,
  fotoBanner,
  setFotoBanner,
  fotoPerfilUrl,
  fotoBannerUrl,
  escolherImagem,
  fontsLoaded,
}) {
  if (!fontsLoaded) return null;

  const [showModalAtualizar, setShowModalAtualizar] = useState(false);
  const [campoAtual, setCampoAtual] = useState(null);
  const [valorCampo, setValorCampo] = useState("");
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await usuario.logoutUser();
      await AsyncStorage.clear();
      setLogoutModalVisible(false);
      onClose();
      navigation.navigate("Splash");
    } catch (e) {
      console.error("Erro ao sair:", e);
    }
  };

  const abrirModalAtualizacao = (key, label, valorAntigo) => {
    setCampoAtual({ key, label, valorAntigo });
    setValorCampo(valorAntigo || "");
    setShowModalAtualizar(true);
  };

  const salvarCampo = () => {
    if (!campoAtual) return;
    const novoValor = valorCampo.trim();
    setEditData((prev) => ({ ...prev, [campoAtual.key]: novoValor }));
    setValorCampo("");
    setCampoAtual(null);
    setShowModalAtualizar(false);
  };

  const campos = [
    { label: "Nome", key: "nomeCompletoUsuario" },
    { label: "Nascimento", key: "dataNascimentoUsuario", isDate: true },
    { label: "Gênero", key: "generoUsuario" },
    { label: "Estado", key: "estadoUsuario" },
    { label: "Cidade", key: "cidadeUsuario" },
    { label: "Altura (cm)", key: "alturaCm", keyboardType: "numeric" },
    { label: "Peso (kg)", key: "pesoKg", keyboardType: "numeric" },
    { label: "Mão Dominante", key: "maoDominante" },
    { label: "Pé Dominante", key: "peDominante" },
  ];

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={tw`flex-1 bg-white`}>
        {/* HEADER */}
        <View className="flex-row items-center justify-around gap-10 px-2 py-3 border-b border-gray-200">
          <Pressable
            style={tw`p-3 bg-[#61D483] w-[40px] h-[40px] rounded-full items-center justify-center`}
            onPress={onClose}
          >
            <Image
              style={{ width: 12, height: 20, marginRight: 4 }}
              source={require("../../../assets/cadastro/icon_voltar.png")}
            />
          </Pressable>

          <Text
            style={[
              tw`text-[20px] text-[#61D483]`,
              { fontFamily: "Poppins_500Medium" },
            ]}
          >
            Editar Perfil
          </Text>

          <Pressable
            className="bg-[#61D483] flex-row rounded-full flex p-2 px-4"
            onPress={saveInfo}
          >
            <Text style={tw`font-semibold text-base text-white`}>Salvar</Text>

            <View className="justify-center items-center bg-[#ffff] rounded-full w-[40%] ml-2">
              <Image
                source={require("../../../assets/icons/icon_salvar.png")}
                style={{ width: 17, height: 12 }}
              />
            </View>
          </Pressable>
        </View>

        {/* BODY */}
        <ScrollView>
          {/* Imagens */}
          <View style={tw`items-center mt-4 relative`}>
            {/* Banner */}
            <Pressable
              onPress={() => escolherImagem("banner")}
              style={tw`w-full h-40 bg-gray-200 justify-center items-center`}
            >
              <ImageBackground
                source={
                  fotoBannerUrl
                    ? { uri: fotoBannerUrl }
                    : require("../../../assets/perfil/banner.png")
                }
                style={tw`w-full h-full justify-center items-center`}
              >
                <View style={tw`bg-black/40 p-2 rounded-full`}>
                  <Image
                    source={require("../../../assets/perfil/camera_icone.png")}
                    style={{ width: 25, height: 20, tintColor: "white" }}
                  />
                </View>
              </ImageBackground>
            </Pressable>

            {/* Foto de perfil */}
            <View style={tw`absolute -bottom-16 items-center`}>
              <Pressable
                onPress={() => escolherImagem("perfil")}
                style={tw`relative`}
              >
                <Image
                  source={
                    fotoPerfilUrl
                      ? { uri: fotoPerfilUrl }
                      : require("../../../assets/perfil/fotoPerfil.png")
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
                    source={require("../../../assets/perfil/camera_icone.png")}
                    style={{ width: 20, height: 15, tintColor: "white" }}
                  />
                </View>
              </Pressable>
            </View>
          </View>

          {/* Informações Pessoais */}
          <View style={tw`mt-24 px-4`}>
            <Text
              style={[
                tw`text-xl text-[#61D483] mb-4`,
                { fontFamily: "Poppins_500Medium" },
              ]}
            >
              Informações Pessoais
            </Text>

            {campos.map((field) => {
              if (field.key === "maoDominante") {
                return (
                  <View key={field.key} style={tw`mb-4`}>
                    <Text
                      style={[
                        tw`text-gray-500 text-sm mb-2`,
                        { fontFamily: "Poppins_500Medium", color: "#61D483" },
                      ]}
                    >
                      {field.label}
                    </Text>
                    <View
                      style={tw`mb-2 p-3 rounded-lg border border-gray-200 flex-row items-center`}
                    >
                      <Icon
                        name="hand-back-right"
                        size={20}
                        color="#61D483"
                        style={{ marginRight: 8 }}
                      />
                      <View style={{ flex: 1 }}>
                        <Picker
                          selectedValue={editData.maoDominante}
                          onValueChange={(value) =>
                            setEditData((prev) => ({
                              ...prev,
                              maoDominante: value,
                            }))
                          }
                          style={{
                            height: 20,
                            width: "100%",
                            borderRadius: 10,
                          }}
                        >
                          <Picker.Item label="Selecione..." value={null} />
                          <Picker.Item label="Destro(a)" value="Destro" />
                          <Picker.Item label="Canhoto(a)" value="Canhoto" />
                        </Picker>
                      </View>
                    </View>
                  </View>
                );
              }

              if (field.key === "peDominante") {
                return (
                  <View key={field.key} style={tw`mb-4`}>
                    <Text
                      style={[
                        tw`text-gray-500 text-sm mb-2`,
                        { fontFamily: "Poppins_500Medium", color: "#61D483" },
                      ]}
                    >
                      {field.label}
                    </Text>
                    <View
                      style={tw`mb-2 p-3 rounded-lg border border-gray-200 flex-row items-center`}
                    >
                      <Icon
                        name="foot-print"
                        size={20}
                        color="#61D483"
                        style={{ marginRight: 8 }}
                      />
                      <View style={{ flex: 1 }}>
                        <Picker
                          selectedValue={editData.peDominante}
                          onValueChange={(value) =>
                            setEditData((prev) => ({
                              ...prev,
                              peDominante: value,
                            }))
                          }
                          style={{
                            height: 20,
                            width: "100%",
                            borderRadius: 10,
                          }}
                        >
                          <Picker.Item label="Selecione..." value={null} />
                          <Picker.Item label="Direito" value="Direito" />
                          <Picker.Item label="Esquerdo" value="Esquerdo" />
                        </Picker>
                      </View>
                    </View>
                  </View>
                );
              }

              return (
                <Pressable
                  key={field.key}
                  onPress={() =>
                    abrirModalAtualizacao(
                      field.key,
                      field.label,
                      editData[field.key]
                    )
                  }
                  style={tw`mb-4 p-3 gap-2 items-center justify-between flex-row border border-gray-200 rounded-lg`}
                >
                  <View style={tw`flex-row gap-2`}>
                    <Text
                      style={[
                        tw`text-gray-500 text-sm`,
                        { fontFamily: "Poppins_500Medium", color: "#61D483" },
                      ]}
                    >
                      {field.label}:
                    </Text>
                    <Text style={[tw``, { fontFamily: "Poppins_500Medium" }]}>
                      {editData[field.key] || ""}
                    </Text>
                  </View>

                  <Image
                    source={require("../../../assets/icons/icon_editar.png")}
                    style={{ width: 10, height: 16 }}
                  />
                </Pressable>
              );
            })}
          </View>
          {/* Botão Sair */}
          <View style={tw`px-4 mt-6 mb-8`}>
            <Pressable
              onPress={() => setLogoutModalVisible(true)}
              style={tw`w-full items-center bg-white border border-red-400 rounded-lg p-3`}
            >
              <Text
                style={[tw`text-red-600`, { fontFamily: "Poppins_500Medium" }]}
              >
                Sair
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>

      <Modal
        visible={logoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={tw`flex-1 justify-center items-center`}>
          <View
            style={tw`bg-white p-6 rounded-3xl w-80 border-[4px] border-[#61D483]`}
          >
            <Text className="text-lg font-semibold mb-4 text-center">
              Deseja mesmo sair?
            </Text>
            <View className="flex-row justify-evenly">
              <TouchableOpacity
                onPress={() => setLogoutModalVisible(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                <Text>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleLogout}
                className="px-4 py-2 bg-[#D46161] rounded"
              >
                <Text className="text-white">Sair</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ModalAtualizarCampo
        visible={showModalAtualizar}
        onClose={() => setShowModalAtualizar(false)}
        campoAtual={campoAtual}
        valorCampo={valorCampo}
        setValorCampo={setValorCampo}
        onSave={salvarCampo}
      />
    </Modal>
  );
}
