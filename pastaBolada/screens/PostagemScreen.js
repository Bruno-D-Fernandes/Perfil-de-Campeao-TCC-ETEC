import { useState } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Modal, TextInput } from "react-native-web";

export default function HomeScreen() {
  [cellModal, setCellModal] = useState(false);

  const imageMap = {
    0: require("../../assets/icons-postagem/SetaIconPostagem.png"),
    1: require("../../assets/icons-postagem/localizacaoIconPostagem.png"),
    2: require("../../assets/icons-postagem/hashtagIconPostagem.png"),
  };

  function Usuario() {
    // {imagem, nome} colocar parametro depois
    return (
      <View className="w-full h-13 flex-row justify-start gap-[10px] items-center">
        {" "}
        {/*Parte do Perfil*/}
        <Image
          source={require("../../assets/post/perfilFoto.png")}
          className="w-10 h-10"
        />
        <Text className="text-base">VInicius</Text>
      </View>
    );
  }

  function IconsBottom() {
    return (
      <View className="w-full h-20 flex-row justify-between items-center">
        <View className="flex-row gap-[5px]">
          <Pressable
            onPress={() => {
              setCellModal(true);
            }}
          >
            {" "}
            {/*Arrumar o onClick()*/}
            <Image
              source={require("../../assets/icons-postagem/imagemIConPostagem.png")}
              className="w-10 h-10"
            />
          </Pressable>

          <Pressable>
            {" "}
            {/*Arrumar o onClick()*/}
            <Image
              source={require("../../assets/icons-postagem/localizacaoIconPostagem.png")}
              className="w-10 h-10"
            />
          </Pressable>

          <Pressable>
            {" "}
            {/*Arrumar o onClick()*/}
            <Image
              source={require("../../assets/icons-postagem/hashtagIconPostagem.png")}
              className="w-10 h-10"
            />
          </Pressable>
        </View>

        <Pressable>
          {" "}
          {/*Arrumar o onClick()*/}
          <Image
            source={require("../../assets/icons-postagem/SetaIconPostagem.png")}
            className="w-10 h-10"
          />
        </Pressable>
      </View>
    );
  }

  function Card({ nome, imagem }) {
    return (
      <Pressable className="bg-[#D9D9D9]/50 flex-row rounded-3x2 ">
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
      <View className="h-[50%]">
        <Usuario />

        <TextInput
          className="w-85 h-[70%] bg-white p-4 rounded-2xl border-[2px] border-[#61D483] "
          multiline={true}
        />
      </View>

      {/* Icones inferior, faz aparecer modal */}
      <IconsBottom />

      {/* Modal abaixo */}

      <Modal transparent={true} visible={cellModal} animationType="slide">
        <Pressable
          className="flex-1 justify-end items-center"
          onPress={() => setCellModal(false)} 
        >
          <Pressable
            className="w-[80%] h-[50%] bg-white border-[2px] border-[#61D483] rounded-tl-[36px] rounded-tr-[36px] p-4 items-center border-b-0"
          >
            <View className="h-[2px] w-[80px] bg-[#61D483] m-[20px] mb-[40px]">
              {" "}
            </View>
            <View className="flex-row flex-wrap justify-between">
              <View className="w-1/2 p-2">
                <Card nome={"Mídia"} imagem={0} />
              </View>
              <View className="w-1/2 p-2">
                <Card nome={"Localização"} imagem={1} />
              </View>
              <View className="w-1/2 p-2">
                <Card nome={"Hashtag"} imagem={2} />
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
