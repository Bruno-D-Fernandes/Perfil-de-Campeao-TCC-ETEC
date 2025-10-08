import React from "react";
import { View, Text } from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import Icon from "react-native-vector-icons/MaterialIcons";
import tw from "twrnc";

export default function TopNotification({ error }) {
  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutUp}
      style={tw`
        absolute top-[10px] z-10 w-[90%] self-center
        flex-row items-center justify-start
        bg-white rounded-md p-5
        shadow-md shadow-black/40
        rounded-xl
        border-2 border-red-400 rounded-2xl
      `}
    >

      {/* Ícone */}
      <Icon name="info" size={30} color="red" /> {/* Trocar icone e fazer alguma estilização --Bruno */}

      {/* Container do Texto */}
      <View style={tw`ml-3`}>
        {/* Título "Erro" */}
        <Text style={tw` font-bold text-base`}>
          Erro
        </Text>
        
        {/* Mensagem de erro dinâmica */}
        <Text style={tw`font-medium text-sm`}>
          {error} {/* Arrumar a quebra de texto */}
        </Text>
      </View>
    </Animated.View>
  );
}
