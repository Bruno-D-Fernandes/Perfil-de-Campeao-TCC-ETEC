import { useEffect } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import splashUser from "./../../services/usuario"

export default function SplashScreen() {

    // Arrumar fontes
    const navigation = useNavigation();

    useEffect(() => {
        try {
            const token = localStorage.getItem('token');
            splashUser(token).then((response) => {
                if (response.data.token) {
                    navigation.navigate('MainApp');
                } 
              });	
        } catch (error) {
            console.error(error);
        }
    }, []);

      // useEffect(() => {
      //   const token = localStorage.getItem('token');
      //   if(token) {
      //     api.login(token)
      //     .then(response => {
      //       const { user } = response.data;
      //       localStorage.setItem('user', JSON.stringify(user));
      //       navigation.navigate('MainApp');
      //     });
      //   }
      // }, []);

  return (
    <View className="flex-1 justify-end items-end h-full flex-col items-center">
      <Image
        source={require("../../assets/Splash/imagem.png")}
        className="absolute w-full h-full"
        resizeMode="cover"
      />

      <View className="w-full h-[350px] justify-evenly items-center">
        <Text className="w-[80%] text-white text-[48px] leading-[90%]">
          Pratique o esporte como você nunca viu.
        </Text>

        <Pressable className="mt-4 w-[80%] rounded-[40px] h-[50px] bg-white rounded-full flex-row items-center justify-between" onPress={() => navigation.navigate('AuthStack', { screen: 'Login' })}>
          <Text className="ml-5 text-[20px] text-[#2BEF66]">LET'S GO</Text>

          <View className="h-10 w-10 rounded-full bg-[#2BEF66] justify-center items-center mr-1">
            <Text className="text-[25px] text-white">&gt;</Text>
          </View>
        </Pressable>

      </View>
    </View>
  );
}
