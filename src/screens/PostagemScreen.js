import React, { useState, useEffect, useLayoutEffect } from "react"; // Adicione o 'React' aqui
import { View, Text, Image, Pressable, Alert } from "react-native";
import { Modal, TextInput } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { Platform } from "react-native";

import tw from "twrnc";

import usuario from "./../../services/usuario";
import { loadPerfilAll } from "./../../services/perfil";
import { postagemData } from "./../../services/postagem";

export default function PostagemScreen() {
  const navigation = useNavigation();

  const [cellModal, setCellModal] = useState(false);
  const [imagem, setImagem] = useState(null);

  const [selectedEsporte, setSelectedEsporte] = useState(null);
  const [perfis, setPerfis] = useState([]);
  const [textoPostagem, setTextoPostagem] = useState("");

  // Carrega dados do usuário e logo abaixo dois useEffect relacionados

  const loadUserData = async () => {
    try {
      // setLoading(true);
      const response = await usuario.splashUser();
      // setUserData(response?.data); parte de informações do usuario
      // setError(null);

      const responsePerfil = await loadPerfilAll(); // aqui pode ser mais interessante fazer uma query na api para saber somente os esportes, depois refinar isso --Bruno
      setPerfis(responsePerfil);
    } catch (err) {
      // setError("Erro ao carregar dados do usuário");
      console.error("Erro ao carregar dados:", err);
    }
    // finally {
    //   setLoading(false);
    // }
  };

  useEffect(() => {
    if (perfis && Object.keys(perfis).length > 0 && !selectedEsporte) {
      setSelectedEsporte(Object.keys(perfis)[0]);
    }
  }, [perfis]);

  useEffect(() => {
    loadUserData();
  }, []);

  // Função para solicitar permissão da câmera
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
        if (fileName.toLowerCase().endsWith(".png")) {
          fileType = "image/png";
        } else if (
          fileName.toLowerCase().endsWith(".jpg") ||
          fileName.toLowerCase().endsWith(".jpeg")
        ) {
          fileType = "image/jpeg";
        } else {
          fileType = "application/octet-stream";
        }

        if (Platform.OS === "web") {
          const response = await fetch(imagem);
          const blob = await response.blob();
          formData.append("imagem", blob, fileName);
        } else {
          formData.append("imagem", {
            uri: imagem,
            name: fileName,
            type: fileType,
          });
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
          <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "600" }}>
            Postar
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, handlePostagem]);

  // Função para tirar foto usando a câmera || colocar essa função no utils
  const tirarFoto = async () => {
    const permissao = await solicitarPermissaoCamera();
    if (!permissao) return;

    const resultado = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!resultado.canceled) {
      setImagem(resultado.assets[0].uri);
    }
  };

  const imageMap = {
    0: require("../../assets/icons-postagem/SetaIconPostagem.png"),
    1: require("../../assets/icons-postagem/localizacaoIconPostagem.png"),
    2: require("../../assets/icons-postagem/hashtagIconPostagem.png"),
  };

  function Usuario() {
    // {imagem, nome} colocar parametro depois
    return (
      <View className="w-full h-[63px] flex-row justify-start gap-[14px] items-center my-4 ml-5">
        <Image
          source={require("../../assets/post/perfilFoto.png")}
          style={{ width: 63, height: 63 }}
          resizeMode="cover"
        />
        <Text className="text-[18px] font-semibold text-[#959595]">
          Nome Usuario
        </Text>
      </View>
    );
  }

  function IconsBottom() {
    return (
      <View className="w-90 h-10 flex-row justify-between mx-[5px]">
        <View className="flex-row gap-[16px]">
          <Pressable
            onPress={() => {
              setCellModal(true);
            }}
          >
            {/*Arrumar o onClick()*/}
            <Image
              source={require("../../assets/icons-postagem/imagemIConPostagem.png")}
              className="w-10 h-10"
            />
          </Pressable>

          <Pressable>
            {/*Arrumar o onClick()*/}
            <Image
              source={require("../../assets/icons-postagem/localizacaoIconPostagem.png")}
              className="w-10 h-10"
            />
          </Pressable>

          <Pressable>
            {/*Arrumar o onClick()*/}
            <Image
              source={require("../../assets/icons-postagem/hashtagIconPostagem.png")}
              className="w-10 h-10"
            />
          </Pressable>
        </View>

        <Pressable className="justify-center items-center">
          {/*Arrumar o onClick()*/}
          <Image
            source={require("../../assets/icons-postagem/SetaIconPostagem.png")}
            className="w-10 h-10"
          />
        </Pressable>
      </View>
    );
  }

  function Card({ nome, imagem, onPress }) {
    return (
      <Pressable
        onPress={onPress}
        className="bg-[#D9D9D9]/50 flex-row rounded-[12px] h-full w-full items-center p-2 my-[10px]"
      >
        <Image source={imageMap[imagem]} className="w-10 h-10" />
        <Text>{nome}</Text>
      </Pressable>
    );
  }

  {
    /* <Button title="Ir para Detalhes" onPress={() => navigation.navigate('Detalhes')} /> */
  }

  return (
    <View className="w-full h-full bg-white gap-10 direction-col justify-between    ">
      <View className="h-[50%] w-full items-center">
        <Usuario />

        <TextInput
          className="w-[95%] h-[70%] bg-white p-4 rounded-[20px] border-[2px] border-[#61D483]/60 font-medium text-[#61D483] text-[20px]"
          multiline={true}
          placeholder="Sobre o que você quer falar?"
          placeholderTextColor="#61D483/60"
          onChangeText={(text) => setTextoPostagem(text)}
        />
      </View>

      <View style={tw`w-85 justify-end rounded-t-5`}>
        {/* Picker para o esporte */}
        <Picker
          style={tw`w-full px-4 h-12 border-none bg-red-200 rounded-t-5`}
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

      {/* Icones inferior, faz aparecer modal */}
      <IconsBottom />

      {/* Modal abaixo */}

      <Modal transparent={true} visible={cellModal} animationType="slide">
        <Pressable
          className="flex-1 justify-end items-center"
          onPress={() => setCellModal(false)}
        >
          <Pressable className="w-[95%] h-[45%] bg-white border-[2px] border-[#61D483] rounded-tl-[36px] rounded-tr-[36px] p-4 items-center border-b-0">
            <View className="h-[2px] w-[80px] bg-[#61D483] m-[20px] mb-[40px]"></View>
            <Text className="font-semibold text-[24px] text-[#61D483] mb-[10px] mr-[10px]">
              Adicione Seu post:
            </Text>
            <View className="flex-row flex-wrap justify-between">
              <View className="w-[48%] h-[50px] rounded-[12px] my-[10px]">
                <Card nome={"Mídia"} imagem={0} onPress={tirarFoto} />
              </View>
              <View className="w-[48%] h-[50px] rounded-[12px] my-[10px]">
                <Card nome={"Localização"} imagem={1} />
              </View>
              <View className="w-[48%] h-[50px] rounded-[12px] my-[10px]">
                <Card nome={"Hashtag"} imagem={2} />
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
