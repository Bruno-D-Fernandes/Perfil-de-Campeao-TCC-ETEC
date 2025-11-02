import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  ImageBackground,
  Modal,
  Platform,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import tw from "twrnc";

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
        <View
          style={tw`flex-row items-center justify-between px-4 py-3 border-b border-gray-200`}
        >
          <Pressable style={tw`p-2`} onPress={onClose}>
            <Image
              style={{ width: 12, height: 20 }}
              source={require("../../../assets/cadastro/icon_voltar.png")}
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

        {/* BODY */}
        <ScrollView>
          {/* Seção de Imagens */}
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
              <Pressable onPress={() => escolherImagem("perfil")} style={tw`relative`}>
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

          {/* Seção de Informações */}
          <View style={tw`mt-24 px-4`}>
            <Text
              style={[
                tw`text-xl text-[#61D483] mb-4`,
                { fontFamily: "Poppins_500Medium" },
              ]}
            >
              Informações Pessoais
            </Text>

            {campos.map((field) => (
              <View
                key={field.key}
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
                  <Text
                    style={[tw``, { fontFamily: "Poppins_500Medium" }]}
                  >
                    {editData[field.key] || ""}
                  </Text>
                </View>

                <Image
                  source={require("../../../assets/icons/icon_editar.png")}
                  style={{ width: 10, height: 16 }}
                />
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>

    
  );
}
