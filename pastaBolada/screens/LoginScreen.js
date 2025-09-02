import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import usuario from './../../services/usuario';

export default function HomeScreen() {
  const navigation = useNavigation();

  const [emailUsuario, setEmailUsuario] = useState('');
  const [senhaUsuario, setSenhaUsuario] = useState('');

  async function handleLogin() {
    try {
      const response = await usuario.loginUser({ emailUsuario, senhaUsuario });
      if (response.data.access_token) {
        await AsyncStorage.setItem('token', response.data.access_token);
        navigation.navigate('MainApp');
      } else {
        Alert.alert('Login falhou', 'Verifique suas credenciais.'); // arrumar isso
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Ocorreu um erro durante o login. Tente novamente.'); // arrumar isso
    }
  }

  return (
    <View className="flex-1 bg-white justify-center px-6">
      <Text className="text-3xl font-bold mb-8 text-center">Login</Text>

      <TextInput
        value={emailUsuario}
        onChangeText={setEmailUsuario}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        className="border border-gray-300 rounded-md px-4 py-3 mb-4 text-base"
      />

      <TextInput
        value={senhaUsuario}
        onChangeText={setSenhaUsuario}
        placeholder="Senha"
        secureTextEntry
        className="border border-gray-300 rounded-md px-4 py-3 mb-6 text-base"
      />

      <Pressable
        onPress={handleLogin}
        className="bg-blue-600 rounded-md py-3"
        android_ripple={{ color: 'rgba(255,255,255,0.3)' }}
      >
        <Text className="text-white text-center font-semibold text-lg">Entrar</Text>
      </Pressable>

      
      <Pressable onPress={() => navigation.navigate('AuthStack', { screen: 'Cadastro' })} className=" mt-4 items-center">
          <Text className="text-black text-[18px]">Criar Conta</Text>
        </Pressable>
    </View>
  );
}
