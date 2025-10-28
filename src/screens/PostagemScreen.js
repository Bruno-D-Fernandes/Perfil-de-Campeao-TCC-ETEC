import { useState, Platform } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  Alert,
  TextInput,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import postagemService from "../../services/postagem";

export default function PostagemScreen() {
  const [cellModal, setCellModal] = useState(false);
  const [imagem, setImagem] = useState(null);
  const [textoPostagem, setTextoPostagem] = useState("");
  const [localizacaoPostagem, setLocalizacaoPostagem] = useState("");
  const [loading, setLoading] = useState(false);

  const solicitarPermissaoCamera = async () => {
    const camera = await ImagePicker.requestCameraPermissionsAsync();
    if (camera.status !== "granted") {
      Alert.alert("Permissão negada", "É necessário permitir acesso à câmera.");
      return false;
    }
    return true;
  };

  const tirarFoto = async () => {
    if (Platform.OS === "web") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (e) => {
        if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const url = URL.createObjectURL(file);
          setImagem(url);
        }
      };
      input.click();
    } else {
      // Mobile
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
    }
  };

  const enviarPostagem = async () => {
    if (!textoPostagem.trim()) {
      Alert.alert("Atenção", "Escreva algo antes de postar!");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("textoPostagem", textoPostagem);
      formData.append("localizacaoPostagem", localizacaoPostagem);

      if (imagem) {
        let filename = imagem.split("/").pop();
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        let fileToUpload;

        if (Platform.OS === "web") {
          const response = await fetch(imagem);
          const blob = await response.blob();
          fileToUpload = new File([blob], filename, { type });
        } else {
          fileToUpload = { uri: imagem, name: filename, type };
        }

        formData.append("imagem", fileToUpload);
      }

      for (let [key, value] of formData.entries()) {
        console.log(key, typeof value === "object" ? value.name : value);
      }

      const response = await postagemService.postagemData(formData);

      console.log("Resposta da API:", response);
      Alert.alert("Sucesso!", "Postagem criada com sucesso!");

      setTextoPostagem("");
      setImagem(null);
    } catch (error) {
      console.error("Erro ao enviar postagem:", error.response?.data || error);
      Alert.alert("Erro", "Falha ao criar postagem.");
    } finally {
      setLoading(false);
    }
  };

  function Usuario() {
    return (
      <View className="w-full h-[63px] flex-row justify-start gap-[14px] items-center my-4 ml-5">
        <Image
          source={require("../../assets/post/perfilFoto.png")}
          style={{ width: 63, height: 63 }}
          resizeMode="cover"
        />
        <Text className="text-[18px] font-semibold text-[#959595]">
          Vinicius
        </Text>
      </View>
    );
  }

  function Card({ nome, imagem, onPress }) {
    const imageMap = {
      0: require("../../assets/icons-postagem/SetaIconPostagem.png"),
      1: require("../../assets/icons-postagem/localizacaoIconPostagem.png"),
      2: require("../../assets/icons-postagem/hashtagIconPostagem.png"),
    };

    return (
      <Pressable
        onPress={onPress}
        className="bg-[#D9D9D9]/50 flex-row rounded-[12px] h-full w-full items-center p-2 my-[10px]"
      >
        <Image source={imageMap[imagem]} className="w-10 h-10" />
        <Text className="ml-2">{nome}</Text>
      </Pressable>
    );
  }

  function IconsBottom() {
    return (
      <View className="w-full flex-row justify-between items-center px-4 mt-4">
        {/* Ícones à esquerda */}
        <View className="flex-row gap-4">
          <Pressable onPress={() => setCellModal(true)}>
            <Image
              source={require("../../assets/icons-postagem/imagemIConPostagem.png")}
              className="w-10 h-10"
            />
          </Pressable>

          <Pressable>
            <Image
              source={require("../../assets/icons-postagem/localizacaoIconPostagem.png")}
              className="w-10 h-10"
            />
          </Pressable>
        </View>

        {/* Botão de postar */}
        <TouchableOpacity
          onPress={enviarPostagem}
          activeOpacity={0.7}
          className="bg-[#61D483] px-5 py-2 rounded-[14px] flex-row items-center"
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text className="text-white text-[16px] font-semibold mr-2">
                Postar
              </Text>
              <Image
                source={require("../../assets/icons-postagem/SetaIconPostagem.png")}
                className="w-6 h-6"
              />
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="w-full h-full bg-white justify-between pb-8">
      <View className="h-[70%] w-full items-center">
        <Usuario />

        <TextInput
          className="w-[95%] h-[60%] bg-white p-4 rounded-[20px] border-[2px] border-[#61D483]/60 font-medium text-[#61D483] text-[18px]"
          multiline
          placeholder="Sobre o que você quer falar?"
          placeholderTextColor="#61D483/60"
          value={textoPostagem}
          onChangeText={setTextoPostagem}
        />

        {imagem && (
          <Image
            source={{ uri: imagem }}
            className="w-[200px] h-[200px] rounded-[20px] mt-4"
          />
        )}
      </View>

      <IconsBottom />

      {/* Modal */}
      <Modal transparent visible={cellModal} animationType="slide">
        <Pressable
          className="flex-1 justify-end items-center"
          onPress={() => setCellModal(false)}
        >
          <Pressable
            className="w-[95%] h-[45%] bg-white border-[2px] border-[#61D483] rounded-tl-[36px] rounded-tr-[36px] p-4 items-center border-b-0"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="h-[2px] w-[80px] bg-[#61D483] m-[20px] mb-[40px]" />

            <Text className="font-semibold text-[24px] text-[#61D483] mb-[10px]">
              Adicione seu post:
            </Text>

            <View className="flex-row flex-wrap justify-between">
              <View className="w-[48%] h-[50px] rounded-[12px] my-[10px]">
                <Card nome="Mídia" imagem={0} onPress={tirarFoto} />
              </View>
              <View className="w-[48%] h-[50px] rounded-[12px] my-[10px]">
                <Card nome="Localização" imagem={1} />
              </View>
              <View className="w-[48%] h-[50px] rounded-[12px] my-[10px]">
                <Card nome="Hashtag" imagem={2} />
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
