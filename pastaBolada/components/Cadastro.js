import { Text, View, Image, TextInput, ScrollView, Pressable,  Modal } from "react-native";
import { useState } from "react";

export default function Cadastro({
  idUser = "1",
  fraseImagem1 = ["Venha conhercer um"],
  fraseImagem2 = ["mundo"],
  fraseImagem3 = ["de"],
  fraseImagem4 = ["oportunidades"],
  nameUser = "",
  anoNascUser = "",
  generoUser = "",
  estadoUser = "",
  cidadeUser = "",
  imagem = true,
}) {
  const [modalVisible, setModalVisible] = useState(true);
  const [tipoUser, setTipoUser] = useState("");

  return (
    <View className="flex-1 bg-white">
       <Modal visible={modalVisible} animationType="fade" transparent>
        <View className="flex-1 justify-end items-center bg-black/50">
          <View className="bg-white w-full p-6 rounded-3xl items-center">
            <Text className="text-[24px] font-bold mb-4 text-[#4ADC76]">
              Escolha a opção que
            </Text>
            <Text className="break-normal text-[24px] font-bold mb-4 text-[#4ADC76]">
              melhor representa
            </Text>
            <Text className="break-normal text-[24px] font-bold mb-4 text-[#4ADC76]">
              você.
            </Text>

            <Pressable
              onPress={() => {
                setTipoUser("Atleta");
                setModalVisible(false);
              }}
              className="bg-[#4ADC76] w-full py-3 rounded-xl mb-3"
            >
              <Text className="text-white text-center font-bold text-lg">
                Atleta
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setTipoUser("Treinador");
                setModalVisible(false);
              }}
              className="bg-[#4ADC76] w-full py-3 rounded-xl"
            >
              <Text className="text-white text-center font-bold text-lg">
                Treinador
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <View className="w-full h-64 relative">
        {imagem && (
          <Image
            source={require("../../assets/cadastro/cadastro_imagem.png")}
            style={{ width: "100%", height: "100%" }}
            className="rounded-e-4xl"
            resizeMode="cover"
          />
        )}

        <View className="absolute inset-0 justify-center items-baseline p-4">
          <Text className="text-white text-xl font-bold">{fraseImagem1}</Text>
          <Text className="text-[#98FFB7] text-xl font-bold">
            {fraseImagem2}
          </Text>
          <Text className="text-white text-xl font-bold">{fraseImagem3}</Text>
          <Text className="text-[#98FFB7] text-xl font-bold">
            {fraseImagem4}
          </Text>
        </View>
      </View>

     
      <ScrollView
        className="w-full px-6"
      >
        <View className="mt-4">
          <Text className="text-[#4ADC76] ml-2">Nome{nameUser}</Text>
          <TextInput
            placeholder=""
            className="border-2 border-[#4ADC76] rounded-xl px-4 py-2 bg-white text-black w-[80%] ms-2"
          />
        </View>

        
        <View className="mt-4">
          <Text className="text-[#4ADC76] ml-2">Ano de Nascimento{anoNascUser}</Text>
          <TextInput
            placeholder=""
            className="border-2 border-[#4ADC76] rounded-xl px-4 py-2 bg-white text-black w-[40%] ms-2"
          />
        </View>


        <View className="mt-4">
          <Text className="text-[#4ADC76] ml-2">Gênero{generoUser}</Text>
          <TextInput
            placeholder=""
            className="border-2 border-[#4ADC76] rounded-xl px-4 py-2 bg-white text-black w-[40%] ms-2"
          />
        </View>

    
        <View className="mt-4">
          <Text className="text-[#4ADC76] ml-2">Estado{estadoUser}</Text>
          <TextInput
            placeholder=""
            className="border-2 border-[#4ADC76] rounded-xl px-4 py-2 bg-white text-black w-[80%] ms-2"
          />
        </View>

     
        <View className="mt-4">
          <Text className="text-[#4ADC76] ml-2">Cidade{cidadeUser}</Text>
          <TextInput
            placeholder=""
            className="border-2 border-[#4ADC76] rounded-xl px-4 py-2 bg-white text-black w-[80%] ms-2"
          />
        </View>

       <View className=" w-full items-end mt-4">
          <Pressable
            onPress={() => console.log()}
            className="bg-[#4ADC76] py-2 px-2 rounded-xl "
          >
            <Text className="text-white text-center font-bold text-lg">
              Próximo
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
