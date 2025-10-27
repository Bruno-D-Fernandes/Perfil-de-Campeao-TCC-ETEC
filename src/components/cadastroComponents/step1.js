import React, { useState } from "react";
import { View, Text, TextInput, Image } from "react-native";
import Animated, {
  SlideOutLeft,
  SlideInRight,
  SlideInLeft,
} from "react-native-reanimated";
import { Picker } from "@react-native-picker/picker";
import tw from "twrnc";
import formatDate from "../../utils/formatDate";

export default function Step1({ formData, updateField, esquerda }) {
  return (
    <View style={tw`flex-1`}>
      <View style={tw`w-full`}>
        <Text style={tw`text-[#4ADC76] text-sm font-semibold mb-2`}>Nome</Text>
        <View
          style={tw`flex-row items-center rounded-xl h-12 border-[#4ADC76] border-2`}
        >
          <Image
            style={{ width: 16, height: 19, marginHorizontal: 12 }}
            source={require("../../../assets/cadastro/icon_user.png")}
          />
          <TextInput
            style={{ flex: 1, height: "90%", fontSize: 14 }}
            placeholder="Seu nome completo"
            placeholderTextColor="#A9A9A9"
            value={formData.nomeCompletoUsuario}
            onChangeText={(text) => updateField("nomeCompletoUsuario", text)}
          />
        </View>
      </View>
      <View style={tw`w-full flex-row justify-between mt-4`}>
        <View style={tw`w-[48%]`}>
          <Text style={tw`text-[#4ADC76] text-sm font-semibold mb-2`}>
            Ano de nasc.
          </Text>
          <View
            style={tw`flex-row items-center rounded-xl h-12 border-[#4ADC76] border-2`}
          >
            <Image
              style={{ width: 16, height: 16, marginHorizontal: 12 }}
              source={require("../../../assets/cadastro/icon_data.png")}
            />
            <TextInput
              style={{ height: "80%", fontSize: 14, width: "75%" }}
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#A9A9A9"
              value={formData.dataNascimentoUsuario}
              onChangeText={(text) =>
                updateField("dataNascimentoUsuario", formatDate(text))
              }
            />
          </View>
        </View>
        <View style={tw`w-[48%]`}>
          {/* Não tenho certeza se isso está certo */}
          <Text style={tw`text-[#4ADC76] text-sm font-semibold mb-2`}>
            Gênero
          </Text>
          <View
            style={tw`flex-row items-center rounded-xl h-12 border-[#4ADC76] border-2 px-2`}
          >
            <Image
              style={{ width: 16, height: 20, marginRight: 6 }}
              source={require("../../../assets/cadastro/icon_genero.png")}
            />
            <View style={tw`flex-1 h-full justify-center`}>
              <Picker
                selectedValue={formData.generoUsuario}
                onValueChange={(value) => updateField("generoUsuario", value)}
                style={{
                  height: 60,
                  width: "100%",
                  backgroundColor: "white",
                  borderRadius: 10,
                }}
              >
                <Picker.Item label="Selecione..." value={null} />
                <Picker.Item label="Masculino" value="masculino" />
                <Picker.Item label="Feminino" value="feminino" />
                <Picker.Item label="Não binário" value="nao-binario" />
                <Picker.Item label="Outro" value="outro" />
              </Picker>
            </View>
          </View>
        </View>
      </View>
      <View style={tw`w-full mt-4`}>
        <Text style={tw`text-[#4ADC76] text-sm font-semibold mb-2`}>
          Estado
        </Text>
        <View
          style={tw`flex-row items-center rounded-xl h-12 border-[#4ADC76] border-2`}
        >
          <Image
            style={{ width: 16, height: 20, marginHorizontal: 12 }}
            source={require("../../../assets/cadastro/icon_local.png")}
          />
          <TextInput
            style={{ flex: 1, height: "100%", fontSize: 14 }}
            placeholder="Estado"
            placeholderTextColor="#A9A9A9"
            value={formData.estadoUsuario}
            onChangeText={(text) => updateField("estadoUsuario", text)}
          />
        </View>
      </View>
      <View style={tw`w-full mt-4`}>
        <Text style={tw`text-[#4ADC76] text-sm font-semibold mb-2`}>
          Cidade
        </Text>
        <View
          style={tw`flex-row items-center rounded-xl h-12 border-[#4ADC76] border-2`}
        >
          <Image
            style={{ width: 16, height: 14, marginHorizontal: 12 }}
            source={require("../../../assets/cadastro/icon_cidade.png")}
          />
          <TextInput
            style={{ flex: 1, height: "100%", fontSize: 14 }}
            placeholder="Cidade"
            placeholderTextColor="#A9A9A9"
            value={formData.cidadeUsuario}
            onChangeText={(text) => updateField("cidadeUsuario", text)}
          />
        </View>
      </View>
    </View>
  );
}
