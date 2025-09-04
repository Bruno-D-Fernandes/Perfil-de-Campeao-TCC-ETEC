import { useEffect } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFonts, Poppins_400Regular, Poppins_700Bold, Poppins_500Medium } from "@expo-google-fonts/poppins";
import AsyncStorage from '@react-native-async-storage/async-storage';
import usuario from "./../../services/usuario";

export default function SplashScreen() {
  const navigation = useNavigation();

     const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Poppins_500Medium
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

      <View className="w-full h-[350px] justify-end items-center">
        <Text className="w-[90%] text-white leading-[90%]" style={{fontFamily:'Poppins_500Medium', fontSize:40,}}>
          Pratique o esporte como você nunca viu.
        </Text>

        <Pressable className="mt-8 mb-8 w-[80%] rounded-[40px] h-[50px] bg-white flex-row items-center justify-between" onPress={() => navigation.navigate('AuthStack', { screen: 'Login' })}>
          <Text className="ml-5 text-[20px] text-[#2BEF66]" style={{fontFamily:'Poppins_500Medium'}}>LET'S GO</Text>

          <View className="h-10 w-10 rounded-full bg-[#2BEF66] justify-center items-center mr-1">
            <Image className='ml-1.5' resizeMode="contain" style={{width:20, height:20}} source={require('../../assets/Splash/icon_proximo.png')} />
          </View>
        </Pressable>

      </View>
    </View>
  );
}
