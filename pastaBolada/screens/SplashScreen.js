import { useEffect } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import usuario from "./../../services/usuario";
import { useFonts, KonkhmerSleokchher_400Regular } from "@expo-google-fonts/konkhmer-sleokchher";

export default function SplashScreen() {
  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    KonkhmerSleokchher_400Regular,
  });
  

  useEffect(() => {
    async function checkToken() {
      try {
        const token = await AsyncStorage.getItem('token');

        if (token) {
          const response = await usuario.perfilUser(token.split(' ')[1]);
          const user = response.data;

          await AsyncStorage.setItem('user', JSON.stringify(user));
          navigation.navigate('MainTabs');
        }
      } catch (error) {
        console.error('Erro ao validar token:', error); // arrumar isso
      }
    }

    checkToken();
  }, []);
  return (
    <View className="flex-1 justify-end items-end h-full flex-col items-center">
      <Image
        source={require("../../assets/Splash/imagem.png")}
        className="absolute w-full h-full" style={{width:'100%', height:'100%',}}
        resizeMode="cover"
      />

      <View className="w-full h-[350px] justify-evenly items-center">
        <Text style={{ fontFamily: "KonkhmerSleokchher_400Regular", fontSize: 40 }} className="w-[80%] text-white text-[48px] leading-[90%]">
          Pratique o esporte como você nunca viu.
        </Text>

        <Pressable className="mt-4 w-[80%] rounded-[40px] h-[50px] bg-white rounded-full flex-row items-center justify-between" onPress={() => navigation.navigate('AuthStack', { screen: 'Login' })}>
          <Text style={{ fontFamily: "KonkhmerSleokchher_400Regular", fontSize: 20 }} className="ml-5 text-[20px] text-[#2BEF66]">LET'S GO</Text>

          <View className="h-10 w-10 rounded-full bg-[#2BEF66] justify-center items-center mr-1">
            <Text className="text-[25px] text-white justify-center mb-[2px]">&gt;
            </Text>
          </View>
        </Pressable>

      </View>
    </View>
  );
}
