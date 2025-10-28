import React from "react";
import { View, Image, ActivityIndicator } from "react-native";

export default function SplashScreen() {
  return (
    <View className='flex-1 bg-[#ffffff] items-center justify-center'>
      <Image
        source={require("../../assets/Splash/loading.gif")}
        className='w-30 h-30'
        style={{width:300, height:300,}}
        resizeMode="contain"
      />
    </View>
  );
}

