import React, { useState, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { View, Text, Image, Pressable, Alert, Modal, TextInput } from "react-native";
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

  const [cellModal, setCellModal] = useState(false);
  const [imagem, setImagem] = useState(null);
  const [localizacao, setLocalizacao] = useState("");


  const [selectedEsporte, setSelectedEsporte] = useState(null);
  const [perfis, setPerfis] = useState([]);
  const [textoPostagem, setTextoPostagem] = useState("");
  const snapPoints = useMemo(() => ["60%", "90%"], []);
  const sheetRef = useRef(null);

  const abrirBottomSheet = () => {
  if (sheetRef.current) {
    sheetRef.current.present();
  }
};


  

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

  function Usuario({ userInfo }) {
  console.log("🧩 userInfo recebido:", userInfo);
  const nome = userInfo?.nome || "Usuário";
  const foto = userInfo?.imagemPerfil; // ajuste conforme o nome da chave que vem da API

  return (
    <View className="w-full h-[63px] flex-row justify-start gap-[14px] items-center my-4 ml-5">
      <Image
        source={
          foto
            ? { uri: foto }
            : require("../../assets/post/perfilFoto.png")
        }
        style={{ width: 63, height: 63, borderRadius: 999 }}
        resizeMode="cover"
      />
      <Text className="text-[18px] font-semibold text-[#959595]">
        {nome}
      </Text>
    </View>
  );
}


  function IconsBottom() {
    return (
      <View className="w-90 h-10 flex-row gap-4 items-center m-[12px]">
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
    <View className="w-full h-full bg-white gap-10 direction-col justify-between">
      <View className="h-[30%] w-full items-center gap-6">
        <Usuario />
        <View className="gap-3 w-[95%]">
          <Text style={{fontFamily:"Poppins_500Medium", fontSize:18, }}>Esporte</Text>
          <View style={tw`w-[100%] items-center px-4 justify-center bg-[#61D48330] rounded-[30px]`}>
          {/* Picker para o esporte */}
            <Picker
              className="w-full h-12 border-none bg-[#4ade8000] text-[#2E7844] text-[18px] outline-none"
              style={{fontFamily:"Poppins_500Medium"}}
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
      </View>
    <View className="gap-3 w-[95%] h-[85%]">
      <Text style={{ fontFamily: "Poppins_500Medium", fontSize: 18 }}>Legenda</Text>

      <TextInput
        className="h-[100%] bg-white p-4 rounded-[20px] border-[2px] border-[#61D483]/60 font-medium text-[#575757] text-[16px] outline-none"
        multiline={true}
        placeholder="Sobre o que você quer falar?"
        placeholderTextColor="#61D483/60"
        maxLength={200} // limita a 100 caracteres
        value={textoPostagem}
        onChangeText={(text) => setTextoPostagem(text)}
      />

          <Text
            style={{
              alignSelf: "flex-end",
              fontSize: 16,
              color: textoPostagem?.length >= 200 ? "red" : "#4ADE80",
              fontFamily: "Poppins_400Regular",
            }}
          >
            {textoPostagem?.length || 0}/200
          </Text>
    </View>

      </View>

      {/* Exibição da imagem selecionada */}
     {/* Campo de localização (fora da imagem) */}
<View className="w-[95%] self-center mt-2">
  <Text style={{ fontFamily: "Poppins_500Medium", fontSize: 18 }}>Localização</Text>
  <TextInput
    className="bg-white p-4 rounded-[20px] border-[2px] border-[#61D483]/60 font-medium text-[#575757] text-[16px] mt-2"
    placeholder="Digite o local do evento..."
    placeholderTextColor="#61D48399"
    value={localizacao}
    onChangeText={setLocalizacao}
  />
</View>

{/* Exibição da imagem selecionada */}
{imagem && (
  <View
    style={{
      width: "95%",
      alignSelf: "center",
      backgroundColor: "#fff",
      borderRadius: 16,
      marginTop: 15,
      position: "relative",
      borderWidth: 1.5,
      borderColor: "#61D48360",
      overflow: "hidden",
    }}
  >
    {/* Imagem */}
    <Image
      source={{ uri: imagem }}
      style={{
        width: "100%",
        height: 180,
      }}
      resizeMode="cover"
    />

    {/* Botão de excluir imagem */}
    <Pressable
      onPress={() => setImagem(null)}
      style={{
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "rgba(255,255,255,0.9)",
        padding: 6,
        borderRadius: 20,
      }}
    >
       <Text>Lixo</Text>
    </Pressable>

    {/* Localização digitada */}
    {localizacao ? (
      <View style={{ padding: 10, flexDirection: "row", alignItems: "center" }}>
      <Text>Lixo</Text>
        <Text
          style={{
            marginLeft: 5,
            fontSize: 14,
            color: "#61D483",
            fontFamily: "Poppins_500Medium",
          }}
        >
          Em: {localizacao}
        </Text>
      </View>
    ) : null}
  </View>
)}



      {/* Icones inferior, faz aparecer modal */}
      <IconsBottom />

      {/* Modal abaixo */}

     
<BottomSheetModal
  ref={sheetRef}
  index={0}
  snapPoints={snapPoints}
  backgroundStyle={{
    backgroundColor: "#fff",
    borderRadius: 25,
    borderColor: "#61D483",
    borderWidth: 2,
    marginHorizontal: "3%", // ✅ 90% visual (5% margem de cada lado)
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
  <BottomSheetView
    style={[
      tw`items-center justify-start w-full`,
      { paddingVertical: 20, paddingHorizontal: 10 },
    ]}
  >
    <Text className="font-semibold text-[20px] text-[#61D483] mb-[15px]">
      Adicione ao seu post:
    </Text>

    <View className="flex-row flex-wrap justify-between w-[95%]">
      <View className="w-[48%] flex-col h-[90px] rounded-[12px] my-[10px]">
        <Card nome={"Mídia"} imagem={0} onPress={tirarFoto} />
      </View>

      <View className="w-[48%] h-[90px] rounded-[12px] my-[10px]">
        <Card nome={"Localização"} imagem={1} />
      </View>

      <View className="w-[48%] h-[90px] rounded-[12px] my-[10px]">
        <Card nome={"Hashtag"} imagem={2} />
      </View>
    </View>
  </BottomSheetView>
</BottomSheetModal>



      </View>

  );
}
