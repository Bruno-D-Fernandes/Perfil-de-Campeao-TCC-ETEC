import React, { useState, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { View, Text, Image, Pressable, Alert, Modal, TextInput, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { Platform } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import tw from "twrnc";

import usuario from "./../../services/usuario";
import { loadPerfilAll } from "./../../services/perfil";
import { postagemData } from "./../../services/postagem";

export default function PostagemScreen() {
  const navigation = useNavigation();

  const [showModalLocal, setShowModalLocal] = useState(false);
  const [imagem, setImagem] = useState(null);
  const [localizacao, setLocalizacao] = useState("");
  const [tempLocalizacao, setTempLocalizacao] = useState("");
  const [selectedEsporte, setSelectedEsporte] = useState(null);
  const [perfis, setPerfis] = useState([]);
  const [textoPostagem, setTextoPostagem] = useState("");

  const snapPoints = useMemo(() => ["60%", "90%"], []);
  const sheetRef = useRef(null);

  const abrirBottomSheet = () => {
    if (sheetRef.current) sheetRef.current.present();
  };

  const abrirModalLocal = () => {
    setShowModalLocal(true);
    setTempLocalizacao(localizacao);
  };

  const fecharModalLocal = () => {
    setShowModalLocal(false);
  };

  const loadUserData = async () => {
    try {
      const response = await usuario.splashUser();
      const responsePerfil = await loadPerfilAll();
      setPerfis(responsePerfil);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
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

  const solicitarPermissaoCamera = async () => {
    const camera = await ImagePicker.requestCameraPermissionsAsync();
    if (camera.status !== "granted") {
      Alert.alert("Permissão negada", "É necessário permitir acesso à câmera.");
      return false;
    }
    return true;
  };

  const handlePostagem = async () => {
    console.log("Handle postagem chamado");

    if (!textoPostagem && !imagem) {
      console.error("Erro", "A postagem precisa de texto ou imagem.");
      return;
    }

    if (!selectedEsporte) {
      console.error("Erro", "Selecione um esporte para a postagem.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("textoPostagem", textoPostagem);

      const perfilSelecionado = Object.values(perfis)
        .flat()
        .find((p) => p.esporte.nomeEsporte === selectedEsporte);

      if (perfilSelecionado) {
        formData.append("esporte_id", perfilSelecionado.esporte.id.toString());
      } else {
        console.error("Erro", "ID do esporte não encontrado.");
        return;
      }

      if (imagem) {
        const fileName = imagem.split("/").pop() || "image.jpg";
        let fileType;

        if (fileName.toLowerCase().endsWith(".png")) fileType = "image/png";
        else if (fileName.toLowerCase().endsWith(".jpg") || fileName.toLowerCase().endsWith(".jpeg"))
          fileType = "image/jpeg";
        else fileType = "application/octet-stream";

        if (Platform.OS === "web") {
          const response = await fetch(imagem);
          const blob = await response.blob();
          formData.append("imagem", blob, fileName);
        } else {
          formData.append("imagem", { uri: imagem, name: fileName, type: fileType });
        }
      }

      const response = await postagemData(formData);
      console.log(response);
    } catch (e) {
      console.error(e);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={handlePostagem}
          style={{
            backgroundColor: "#4ADE80",
            borderRadius: 20,
            paddingHorizontal: 15,
            paddingVertical: 8,
            flexDirection: "row",
            alignItems: "center",
            marginRight: 15,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>Postar</Text>
        </Pressable>
      ),
    });
  }, [navigation, handlePostagem]);

  const tirarFoto = async () => {
    const permissao = await solicitarPermissaoCamera();
    if (!permissao) return;

    const resultado = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!resultado.canceled) setImagem(resultado.assets[0].uri);
  };

  const imageMap = {
    0: require("../../assets/icons-postagem/foto.png"),
    1: require("../../assets/icons-postagem/local.png"),
  };

  function Usuario({ userInfo }) {
    const nome = userInfo?.nomeCompletoUsuario || "Usuário";
    const foto = userInfo?.fotoPerfilUsuario;

    return (
      <View className="w-full h-[63px] flex-row justify-start gap-[14px] items-center my-4 ml-5">
        <Image
          source={foto ? { uri: foto } : require("../../assets/post/perfilFoto.png")}
          style={{ width: 63, height: 63, borderRadius: 999 }}
          resizeMode="cover"
        />
        <Text className="text-[18px] font-semibold text-[#959595]">{nome}</Text>
      </View>
    );
  }

  function IconsBottom() {
    return (
      <View className="w-90 h-10 flex-row gap-4 items-center m-[6px]">
        <View>
          <Pressable className="flex-row items-center gap-[16px]" onPress={abrirBottomSheet}>
            <Image
              source={require("../../assets/icons-postagem/imagemIConPostagem.png")}
              className="w-10 h-10"
            />
            <Image
              source={require("../../assets/icons-postagem/localizacaoIconPostagem.png")}
              className="w-10 h-10"
            />
            <Image
              source={require("../../assets/icons-postagem/SetaIconPostagem.png")}
              className="w-10 h-10"
            />
          </Pressable>
        </View>
      </View>
    );
  }

  function Card({ nome, imagem, onPress, color }) {
    return (
      <Pressable
        onPress={onPress}
        className="bg-[#D9D9D9]/40 rounded-[12px] w-full gap-3 p-3 my-[10px]"
      >
        <View className="flex-row w-full justify-between">
          <Image source={imageMap[imagem]} className="w-10 h-10" />
          <Image
            source={require("../../assets/icons-postagem/mais.png")}
            style={{ width: 16, height: 16, tintColor: color }}
          />
        </View>
        <Text style={{ color, fontFamily: "Poppins_500Medium", fontSize: 18 }}>{nome}</Text>
      </Pressable>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flex: 1, backgroundColor: "#fff", paddingBottom: 6 }}
    >
    <View className="flex-1 bg-white justify-between">
      {/* Usuário e seleção de esporte */}
      <View className="items-center mt-4">
        <Usuario />

        {/* Campo esporte */}
        <View className="w-[90%] mt-3">
          <Text style={{ fontFamily: "Poppins_500Medium", fontSize: 18 }}>Esporte</Text>
          <View className="w-full bg-[#61D48340] rounded-[30px] p-2">
            <Picker
              selectedValue={selectedEsporte}
              onValueChange={(value) => setSelectedEsporte(value)}
              style={{
                backgroundColor:"#61D48300",
                width: "100%",
                color: "#2E7844",
                fontFamily: "Poppins_500Medium",
              }}
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
        </View>

        {/* Campo legenda */}
        <View className="w-[90%] mt-4">
          <Text style={{ fontFamily: "Poppins_500Medium", fontSize: 18 }}>Legenda</Text>

          <TextInput
            multiline
            placeholder="Sobre o que você quer falar?"
            placeholderTextColor="#61D48399"
            value={textoPostagem}
            onChangeText={setTextoPostagem}
            className="bg-white rounded-[20px] border-[2px] border-[#61D483]/60 text-[#575757] text-[16px] mt-2 p-3"
            style={{
              minHeight: 100,
              maxHeight: 160,
              textAlignVertical: "top",
            }}
          />

          <Text
            style={{
              alignSelf: "flex-end",
              marginTop: 4,
              fontSize: 15,
              color: textoPostagem?.length >= 200 ? "red" : "#4ADE80",
              fontFamily: "Poppins_400Regular",
            }}
          >
            {textoPostagem?.length || 0}/200
          </Text>
        </View>

        {/* Imagem selecionada */}
        {imagem && (
          <View
            style={{
              width: "90%",
              alignSelf: "center",
              backgroundColor: "#fff",
              borderRadius: 16,
              borderWidth: 1.5,
              borderColor: "#61D48360",
              overflow: "hidden",
              marginTop: 12,
            }}
          >
            <Image
              source={{ uri: imagem }}
              style={{ width: "100%", height: 180 }}
              resizeMode="cover"
            />

            <Pressable
              onPress={() => setImagem(null)}
              className="absolute top-3 right-3 bg-[#61D48330] rounded-[6px] w-8 h-8 items-center justify-center"
            >
              <Image
                source={require("../../assets/icons-postagem/fechar.png")}
                style={{ tintColor: "#61D483", width: 12, height: 12 }}
              />
            </Pressable>
          </View>
        )}

        {/* Localização */}
        {localizacao && (
          <View
            style={{
              width: "90%",
              alignSelf: "center",
              backgroundColor: "#fff",
              borderRadius: 16,
              marginTop: 12,
              borderWidth: 1.5,
              borderColor: "#61D48360",
              paddingVertical: 8,
              paddingHorizontal: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
              <Image
                source={require("../../assets/icons-postagem/local.png")}
                style={{ tintColor: "#61D483", width: 16, height: 21 }}
              />
              <Text
                style={{
                  marginLeft: 8,
                  fontSize: 15,
                  color: "#61D483",
                  fontFamily: "Poppins_500Medium",
                  flexShrink: 1,
                }}
                numberOfLines={1}
              >
                Em: {localizacao}
              </Text>
            </View>

            <Pressable
              onPress={() => setLocalizacao("")}
              className="bg-[#61D48330] w-8 h-8 items-center justify-center rounded-[6px]"
            >
              <Image
                source={require("../../assets/icons-postagem/fechar.png")}
                style={{ tintColor: "#61D483", width: 12, height: 12 }}
              />
            </Pressable>
          </View>
        )}
      </View>

      {/* Ícones inferiores */}
      <IconsBottom />

        {/* Bottom Sheet */}
        <BottomSheetModal
          ref={sheetRef}
          index={0}
          snapPoints={snapPoints}
          backgroundStyle={{
            backgroundColor: "#fff",
            borderRadius: 25,
            borderColor: "#61D483",
            borderWidth: 2,
            marginHorizontal: "3%",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 6,
            elevation: 12,
          }}
          handleIndicatorStyle={{
            backgroundColor: "#61D483",
            width: 60,
            height: 4,
            borderRadius: 4,
          }}
        >
          <BottomSheetView style={[tw`items-center justify-start w-full`, { paddingVertical: 20, paddingHorizontal: 20 }]}>
            <View className="w-[95%]">
              <Text className="font-semibold text-[20px] text-[#61D483] mb-[15px]">Adicione ao seu post:</Text>
            </View>

            <View className="flex-row flex-wrap justify-between w-[95%]">
              <View className="w-[48%] flex-col h-[90px] rounded-[12px] my-[10px]">
                <Card nome={"Mídia"} imagem={0} color={"#2B87EF"} onPress={tirarFoto} />
              </View>

              <View className="w-[48%] h-[90px] rounded-[12px] my-[10px]">
                <Card nome={"Localização"} imagem={1} color={"#F69533"} onPress={abrirModalLocal} />
              </View>
            </View>
          </BottomSheetView>
        </BottomSheetModal>

        {/* Modal Localização */}
        <Modal visible={showModalLocal} transparent animationType="fade">
          <View className="bg-black/60 flex-1 justify-center items-center">
            <View className="bg-white p-6 rounded-2xl w-[80%]">
              <Text className="text-lg mb-4 text-[#61D483] font-semibold">Adicionar Localização</Text>

              <View className="w-[95%] self-center mt-2">
                <Text style={{ fontFamily: "Poppins_500Medium", fontSize: 18, color: "#333" }}>Localização</Text>
                <TextInput
                  className="bg-white p-4 rounded-[20px] border-[2px] border-[#61D483]/60 font-medium text-[#575757] text-[16px] mt-2"
                  placeholder="Digite o local do evento..."
                  placeholderTextColor="#61D48399"
                  value={tempLocalizacao}
                  onChangeText={setTempLocalizacao}
                />
              </View>

              <View className="flex-row justify-between mt-5">
                <Pressable onPress={fecharModalLocal} className="bg-gray-300 px-4 py-2 rounded-xl w-[45%]">
                  <Text className="text-center text-gray-700 font-semibold">Cancelar</Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    setLocalizacao(tempLocalizacao);
                    fecharModalLocal();
                  }}
                  className="bg-[#61D483] px-4 py-2 rounded-xl w-[45%]"
                >
                  <Text className="text-center text-white font-semibold">Salvar</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}
