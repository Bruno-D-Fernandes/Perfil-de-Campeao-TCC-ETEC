import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, Image, ImageBackground } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_700Bold, Poppins_500Medium } from "@expo-google-fonts/poppins";
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import usuario from './../../services/usuario';


export default function HomeScreen() {
  const navigation = useNavigation();

  const [emailUsuario, setEmailUsuario] = useState('');
  const [senhaUsuario, setSenhaUsuario] = useState('');

   const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Poppins_500Medium
  });


  async function handleLogin() {
    try {
      const response = await usuario.loginUser({ emailUsuario, senhaUsuario });

      if (response?.data?.access_token) { // alguem isso aqui no chat ein
        await AsyncStorage.setItem('token', response.data.access_token);
        
        const responseDois = await usuario.perfilUser(response.data.access_token);
        const user = responseDois.data;

        await AsyncStorage.setItem('user', JSON.stringify(user));
        navigation.navigate('MainTabs');
      } else {
        Alert.alert('Login inválido', 'E-mail ou senha incorretos.'); // fazer modal para possiveis erros
      }
    } catch (error) {
      console.error(error);

      // Se tiver resposta do backend
      if (error.response?.status === 401) {
        Alert.alert('Erro de autenticação', 'E-mail ou senha incorretos.');
      } else {
        Alert.alert('Erro', 'Ocorreu um problema no login. Tente novamente mais tarde.');
      }
    }
  }

  return (
    <ImageBackground
      source={require('../../assets/login/bgBasquete.png')}
      style={{width:"100%", height:"100%"}}
      resizeMode="cover" 
    >
      <View className="flex-1 justify-center items-center p-[2%] gap-4">

        <View className='w-[90%] h-[23%] '>
          <Text className='text-[180%] w-[50%] font-bold text-white leading-tight' style={{fontFamily:'Poppins_500Medium'}}>
            Se <Text className='text-[#98FFB7]'>você </Text>acredita...
          </Text>
          <Text className='text-[180%] w-[80%] font-bold text-white leading-tight' style={{fontFamily:'Poppins_500Medium'}}>
            O <Text className='text-[#98FFB7]'>mundo</Text> também vai acreditar.
          </Text>
        </View>

        <View className='w-[90%] h-[25%] mt-[10%] '>
          {/* Email */}
          <Text className='text-[90%] text-[#98FFB7]' style={{fontFamily:'Poppins_500Medium'}}>E-mail</Text>
          <View className='w-full mb-[10%] p-[3%] rounded-[8px] border-[3px] border-[#98FFB7] flex-row items-center'>
            <Image className='mr-[3%]' style={{width:'6%', height:'60%'}} source={require('../../assets/login/icon_email.png')} />
            <TextInput
              value={emailUsuario}
              onChangeText={setEmailUsuario}
              placeholder="Digite seu e-mail"
              placeholderTextColor="#ccc"
              className='w-[98%] h-[100%] text-white'
              style={{fontFamily:'Poppins_500Medium'}}
            />
          </View>

          {/* Senha */}
          <Text className='text-[90%] text-[#98FFB7]' style={{fontFamily:'Poppins_500Medium'}}>Senha</Text>
          <View className='w-full mb-[10%] p-[3%] rounded-[8px] border-[3px] border-[#98FFB7] flex-row items-center'>
            <Image className='mr-[3%]' style={{width:'5%', height:'70%'}} source={require('../../assets/login/icon_senha.png')} />
            <TextInput
              value={senhaUsuario}
              onChangeText={setSenhaUsuario}
              secureTextEntry={true}
              placeholder="Digite sua senha"
              placeholderTextColor="#ccc"
              className='w-[98%] h-[100%] text-white'
              style={{fontFamily:'Poppins_500Medium'}}
            />
          </View>
        </View>

        {/* Botões */}
        <View className='w-[75%] h-[20%] gap-6 justify-center'>
          <Pressable onPress={handleLogin} className='bg-[#4ADC76] h-[35%] rounded-[30px] items-center justify-between pl-[8%] flex-row'>
            <Text className='text-white text-[110%]' style={{fontFamily:'Poppins_500Medium'}}>Entrar</Text>
            <View className='w-[18%] h-[80%] bg-white m-[3%] rounded-full items-center justify-center'>
              <Image className='ml-[19%]' style={{width:'35%', height:'60%'}} source={require('../../assets/login/icon_seta.png')} />
            </View>
          </Pressable>

          <Pressable onPress={() => navigation.navigate('AuthStack', { screen: 'Cadastro' })} className='w-full items-center'>
            <Text className='text-[#98FFB7]' style={{fontFamily:'Poppins_500Medium'}}>
              Ainda não tem <Text className='underline'>cadastro?</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}
