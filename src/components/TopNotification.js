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
      <Icon name="error" size={30} color="red" />

      <View style={tw`ml-3 flex-1`}>
        {/* Título "Erro" */}
        <Text style={tw` font-bold text-base`}>
          Erro
        </Text>
        
        <Text style={tw`font-medium text-sm`}>
          {error}
        </Text>
      </View>
    </Animated.View>
  );
}
